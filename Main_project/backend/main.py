import logging
import traceback

from fastapi import Depends, FastAPI, Request, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.orm import Session

from auth import create_access_token, decode_token, hash_password, verify_password
from crud import (
    DuplicateNameError, EmptyCartError, ItemNotFoundError, StockConflictError,
    checkout, create_item, get_item, get_items, update_item,
)
from database import Base, engine, get_db
from models import User
from schemas import (
    CheckoutRequest, CheckoutResponse, ItemCreate, ItemResponse,
    UserLogin, UserRegister, UserResponse, TokenResponse,
)

logger = logging.getLogger(__name__)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Grocery Store API")

import os as _os

# ALLOWED_ORIGINS env var: comma-separated list of allowed origins.
# Defaults to localhost for dev. Set it in Render to your frontend URL.
_raw_origins = _os.getenv("ALLOWED_ORIGINS", "")
_explicit = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_explicit if _explicit else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer_scheme = HTTPBearer(auto_error=False)


# ── Auth helpers ─────────────────────────────────────────────────────────────

def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_token(credentials.credentials)
        user_id: int = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


# ── Exception handlers ───────────────────────────────────────────────────────

@app.exception_handler(DuplicateNameError)
async def duplicate_name_handler(request: Request, exc: DuplicateNameError):
    return JSONResponse(status_code=409, content={"error_code": "DUPLICATE_NAME", "message": str(exc)})

@app.exception_handler(ItemNotFoundError)
async def item_not_found_handler(request: Request, exc: ItemNotFoundError):
    return JSONResponse(status_code=404, content={"error_code": "NOT_FOUND", "message": str(exc)})

@app.exception_handler(StockConflictError)
async def stock_conflict_handler(request: Request, exc: StockConflictError):
    return JSONResponse(status_code=409, content={"error_code": "STOCK_CONFLICT", "message": str(exc)})

@app.exception_handler(EmptyCartError)
async def empty_cart_handler(request: Request, exc: EmptyCartError):
    return JSONResponse(status_code=400, content={"error_code": "EMPTY_CART", "message": str(exc)})

@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    # Return the first human-readable error message
    errors = exc.errors()
    messages = []
    for e in errors:
        field = e["loc"][-1] if e.get("loc") else "field"
        msg = e.get("msg", "Invalid value")
        # Clean up pydantic's "Value error, " prefix
        msg = msg.replace("Value error, ", "")
        messages.append(f"{field}: {msg}" if field != "body" else msg)
    return JSONResponse(
        status_code=422,
        content={"detail": messages[0] if len(messages) == 1 else "\n".join(messages)},
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception:\n%s", traceback.format_exc())
    return JSONResponse(status_code=500, content={"error_code": "INTERNAL_ERROR", "message": "An unexpected error occurred."})


# ── Auth routes ──────────────────────────────────────────────────────────────

@app.post("/auth/register", response_model=TokenResponse, status_code=201)
def register(body: UserRegister, db: Session = Depends(get_db)):
    if db.execute(select(User).where(User.username == body.username)).scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Username already taken")
    if db.execute(select(User).where(User.email == body.email)).scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(username=body.username, email=body.email, hashed_password=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@app.post("/auth/login", response_model=TokenResponse)
def login(body: UserLogin, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.username == body.username)).scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@app.get("/auth/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/auth/change-password", status_code=200)
def change_password(
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from auth import verify_password, hash_password
    current_pw = body.get("current_password", "")
    new_pw = body.get("new_password", "")
    if not verify_password(current_pw, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(new_pw) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
    current_user.hashed_password = hash_password(new_pw)
    db.commit()
    return {"message": "Password updated successfully"}


# ── Item routes (protected) ──────────────────────────────────────────────────

@app.get("/items", response_model=list[ItemResponse])
def list_items(
    search: str | None = None, sort_by: str = "name", order: str = "asc",
    page: int = 1, page_size: int = 20,
    db: Session = Depends(get_db),
):
    return get_items(db, search=search, sort_by=sort_by, order=order, page=page, page_size=page_size)


@app.post("/items", response_model=ItemResponse)
def add_item(item: ItemCreate, db: Session = Depends(get_db)):
    return create_item(db, item)


@app.get("/items/{item_id}", response_model=ItemResponse)
def read_item(item_id: int, db: Session = Depends(get_db)):
    return get_item(db, item_id)


@app.put("/items/{item_id}", response_model=ItemResponse)
def edit_item(item_id: int, item: ItemCreate, db: Session = Depends(get_db)):
    return update_item(db, item_id, item)


@app.post("/checkout", response_model=CheckoutResponse)
def do_checkout(request: CheckoutRequest, db: Session = Depends(get_db)):
    return checkout(db, request)
