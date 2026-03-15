"""
Property-based tests for the grocery store backend.
Feature: grocery-store-web-app
Uses pytest + Hypothesis.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from hypothesis import given, settings, HealthCheck
from hypothesis import strategies as st
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
from schemas import CheckoutItem, CheckoutRequest, ItemCreate
from crud import (
    create_item,
    get_items,
    get_item,
    update_item,
    checkout,
    DuplicateNameError,
    StockConflictError,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_db():
    """Return a fresh in-memory session."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine, Session()


def teardown_db(engine, session):
    session.close()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


# ---------------------------------------------------------------------------
# Property 5: Add item persistence round-trip
# Validates: Requirements 2.2, 6.1, 6.3
# ---------------------------------------------------------------------------

# Feature: grocery-store-web-app, Property 5: Add item persistence round-trip
@given(
    name=st.text(min_size=1, max_size=200),
    price=st.integers(min_value=1, max_value=100_000),
    stock=st.integers(min_value=1, max_value=100_000),
)
@settings(max_examples=100, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_add_item_round_trip(name, price, stock):
    """
    For any valid item (non-empty name, positive price, positive stock),
    adding it via crud.create_item and then fetching via crud.get_items
    should return an item with the same name, price, and stock.
    Validates: Requirements 2.2, 6.1, 6.3
    """
    engine, db = make_db()
    try:
        item_in = ItemCreate(name=name, price=price, stock=stock)
        created = create_item(db, item_in)

        items = get_items(db)
        assert any(
            i.name == name and i.price == price and i.stock == stock
            for i in items
        ), f"Created item not found in inventory: {name!r}, {price}, {stock}"

        fetched = get_item(db, created.id)
        assert fetched.name == name
        assert fetched.price == price
        assert fetched.stock == stock
    finally:
        teardown_db(engine, db)


# ---------------------------------------------------------------------------
# Property 8: Duplicate item name rejected
# Validates: Requirements 2.5
# ---------------------------------------------------------------------------

# Feature: grocery-store-web-app, Property 8: Duplicate item name rejected
@given(
    name=st.text(min_size=1, max_size=200),
    price=st.integers(min_value=1, max_value=100_000),
    stock=st.integers(min_value=1, max_value=100_000),
    price2=st.integers(min_value=1, max_value=100_000),
    stock2=st.integers(min_value=1, max_value=100_000),
)
@settings(max_examples=100, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_duplicate_name_rejected(name, price, stock, price2, stock2):
    """
    For any item already present, attempting to add a second item with the
    same name must raise DuplicateNameError and leave the inventory unchanged.
    Validates: Requirements 2.5
    """
    engine, db = make_db()
    try:
        create_item(db, ItemCreate(name=name, price=price, stock=stock))
        items_before = get_items(db)
        count_before = len(items_before)

        with pytest.raises(DuplicateNameError):
            create_item(db, ItemCreate(name=name, price=price2, stock=stock2))

        items_after = get_items(db)
        assert len(items_after) == count_before, (
            "Inventory size changed after duplicate name rejection"
        )
    finally:
        teardown_db(engine, db)


# ---------------------------------------------------------------------------
# Property 11: Edit item persistence round-trip
# Validates: Requirements 3.3
# ---------------------------------------------------------------------------

# Feature: grocery-store-web-app, Property 11: Edit item persistence round-trip
@given(
    original_name=st.text(min_size=1, max_size=200),
    original_price=st.integers(min_value=1, max_value=100_000),
    original_stock=st.integers(min_value=1, max_value=100_000),
    new_name=st.text(min_size=1, max_size=200),
    new_price=st.integers(min_value=1, max_value=100_000),
    new_stock=st.integers(min_value=1, max_value=100_000),
)
@settings(max_examples=100, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_edit_item_round_trip(
    original_name, original_price, original_stock, new_name, new_price, new_stock
):
    """
    For any existing item and any valid update, updating via crud.update_item
    and then fetching should return the updated values.
    Validates: Requirements 3.3
    """
    engine, db = make_db()
    try:
        created = create_item(
            db, ItemCreate(name=original_name, price=original_price, stock=original_stock)
        )

        # If new_name collides with original_name that's fine (same item update).
        # But if they differ we just update.
        updated = update_item(db, created.id, ItemCreate(name=new_name, price=new_price, stock=new_stock))

        assert updated.name == new_name
        assert updated.price == new_price
        assert updated.stock == new_stock

        fetched = get_item(db, created.id)
        assert fetched.name == new_name
        assert fetched.price == new_price
        assert fetched.stock == new_stock
    finally:
        teardown_db(engine, db)


# ---------------------------------------------------------------------------
# Property 15: Checkout deducts stock correctly
# Validates: Requirements 5.1
# ---------------------------------------------------------------------------

# Feature: grocery-store-web-app, Property 15: Checkout deducts stock correctly
@given(
    name=st.text(min_size=1, max_size=200),
    price=st.integers(min_value=1, max_value=100_000),
    stock=st.integers(min_value=1, max_value=100_000),
    customer_name=st.text(min_size=1, max_size=200),
)
@settings(max_examples=100, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_checkout_deducts_stock(name, price, stock, customer_name):
    """
    For any valid checkout request (non-empty cart, all quantities within stock),
    after a successful checkout each item's stock must be reduced by exactly
    the purchased quantity.
    Validates: Requirements 5.1
    """
    engine, db = make_db()
    try:
        created = create_item(db, ItemCreate(name=name, price=price, stock=stock))

        # quantity is always within stock (1..stock)
        quantity = max(1, stock // 2) if stock > 1 else 1

        request = CheckoutRequest(
            customer_name=customer_name,
            items=[CheckoutItem(item_id=created.id, quantity=quantity)],
        )
        checkout(db, request)

        after = get_item(db, created.id)
        assert after.stock == stock - quantity, (
            f"Expected stock {stock - quantity}, got {after.stock}"
        )
    finally:
        teardown_db(engine, db)


# ---------------------------------------------------------------------------
# Property 17: Stock conflict at checkout returns error
# Validates: Requirements 5.6
# ---------------------------------------------------------------------------

# Feature: grocery-store-web-app, Property 17: Stock conflict at checkout returns error
@given(
    name=st.text(min_size=1, max_size=200),
    price=st.integers(min_value=1, max_value=100_000),
    stock=st.integers(min_value=1, max_value=99_999),
    customer_name=st.text(min_size=1, max_size=200),
)
@settings(max_examples=100, suppress_health_check=[HealthCheck.function_scoped_fixture])
def test_stock_conflict_at_checkout(name, price, stock, customer_name):
    """
    For any checkout request where at least one item's requested quantity
    exceeds its current stock, the checkout must raise StockConflictError
    and must not deduct any stock.
    Validates: Requirements 5.6
    """
    engine, db = make_db()
    try:
        created = create_item(db, ItemCreate(name=name, price=price, stock=stock))

        # Request more than available stock
        over_quantity = stock + 1

        request = CheckoutRequest(
            customer_name=customer_name,
            items=[CheckoutItem(item_id=created.id, quantity=over_quantity)],
        )

        with pytest.raises(StockConflictError):
            checkout(db, request)

        # Stock must be unchanged
        after = get_item(db, created.id)
        assert after.stock == stock, (
            f"Stock was modified despite conflict: expected {stock}, got {after.stock}"
        )
    finally:
        teardown_db(engine, db)


# ---------------------------------------------------------------------------
# Property 19: API returns structured error on unexpected failure
# Validates: Requirements 8.3
# ---------------------------------------------------------------------------

# Feature: grocery-store-web-app, Property 19: API returns structured error on unexpected failure
@given(
    error_message=st.text(min_size=1, max_size=200),
)
@settings(max_examples=100, suppress_health_check=[HealthCheck.function_scoped_fixture], deadline=None)
def test_structured_error_on_unexpected_failure(error_message):
    """
    For any unhandled exception in the API, the response must conform to
    { error_code: str, message: str } with HTTP 500.
    Validates: Requirements 8.3
    """
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from main import app as main_app

    # Create a minimal test app that reuses the same exception handlers
    test_app = FastAPI()

    # Copy exception handlers from main app
    for exc_class, handler in main_app.exception_handlers.items():
        test_app.add_exception_handler(exc_class, handler)

    @test_app.get("/test-error")
    def raise_error():
        raise RuntimeError(error_message)

    client = TestClient(test_app, raise_server_exceptions=False)
    response = client.get("/test-error")

    assert response.status_code == 500, (
        f"Expected 500, got {response.status_code}"
    )
    body = response.json()
    assert "error_code" in body, f"Missing 'error_code' in response: {body}"
    assert "message" in body, f"Missing 'message' in response: {body}"
    assert isinstance(body["error_code"], str), "'error_code' must be a string"
    assert isinstance(body["message"], str), "'message' must be a string"
