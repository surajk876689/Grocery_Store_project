from pydantic import BaseModel, Field, field_validator
import re


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1)
    price: int = Field(..., gt=0)
    stock: int = Field(..., gt=0)


class ItemResponse(BaseModel):
    id: int
    name: str
    price: int
    stock: int

    model_config = {"from_attributes": True}


class CheckoutItem(BaseModel):
    item_id: int
    quantity: int = Field(..., gt=0)


class CheckoutRequest(BaseModel):
    customer_name: str = Field(..., min_length=1)
    items: list[CheckoutItem] = Field(..., min_length=1)


class ReceiptLineItem(BaseModel):
    name: str
    unit_price: int
    quantity: int
    line_total: int


class CheckoutResponse(BaseModel):
    customer_name: str
    items: list[ReceiptLineItem]
    grand_total: int


class ErrorResponse(BaseModel):
    error_code: str
    message: str


# ── Auth schemas ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username may only contain letters, numbers and underscores")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-]", v):
            raise ValueError("Password must contain at least one special character")
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
