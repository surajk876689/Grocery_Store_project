import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# In production set DATABASE_URL env var to a persistent path, e.g.:
#   sqlite:////data/grocery.db   (Render persistent disk mounted at /data)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./grocery.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
