from sqlalchemy import select, func
from sqlalchemy.orm import Session

from models import Item
from schemas import CheckoutRequest, CheckoutResponse, ItemCreate, ReceiptLineItem


class DuplicateNameError(Exception):
    def __init__(self, name: str):
        self.name = name
        super().__init__(f"Item with name '{name}' already exists")


class ItemNotFoundError(Exception):
    def __init__(self, item_id: int):
        self.item_id = item_id
        super().__init__(f"Item with id {item_id} not found")


class StockConflictError(Exception):
    def __init__(self, name: str, requested: int, available: int):
        self.name = name
        self.requested = requested
        self.available = available
        super().__init__(
            f"Insufficient stock for: {name} (requested {requested}, available {available})"
        )


class EmptyCartError(Exception):
    pass


def get_items(
    db: Session,
    search: str | None = None,
    sort_by: str = "name",
    order: str = "asc",
    page: int = 1,
    page_size: int = 20,
) -> list[Item]:
    # Cap page_size to prevent abuse
    page_size = min(max(1, page_size), 200)
    page = max(1, page)
    stmt = select(Item)

    if search:
        stmt = stmt.where(func.lower(Item.name).contains(func.lower(search)))

    column = getattr(Item, sort_by, Item.name)
    if order == "desc":
        stmt = stmt.order_by(column.desc())
    else:
        stmt = stmt.order_by(column.asc())

    offset = (page - 1) * page_size
    stmt = stmt.offset(offset).limit(page_size)

    return list(db.execute(stmt).scalars().all())


def get_item(db: Session, item_id: int) -> Item:
    db_item = db.get(Item, item_id)
    if db_item is None:
        raise ItemNotFoundError(item_id)
    return db_item


def create_item(db: Session, item: ItemCreate) -> Item:
    existing = db.execute(select(Item).where(Item.name == item.name)).scalar_one_or_none()
    if existing is not None:
        raise DuplicateNameError(item.name)

    db_item = Item(name=item.name, price=item.price, stock=item.stock)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_item(db: Session, item_id: int, item: ItemCreate) -> Item:
    db_item = db.get(Item, item_id)
    if db_item is None:
        raise ItemNotFoundError(item_id)

    # Check for duplicate name (excluding the current item)
    existing = db.execute(
        select(Item).where(Item.name == item.name, Item.id != item_id)
    ).scalar_one_or_none()
    if existing is not None:
        raise DuplicateNameError(item.name)

    db_item.name = item.name
    db_item.price = item.price
    db_item.stock = item.stock
    db.commit()
    db.refresh(db_item)
    return db_item


def checkout(db: Session, request: CheckoutRequest) -> CheckoutResponse:
    if not request.items:
        raise EmptyCartError("Cart is empty")

    receipt_lines: list[ReceiptLineItem] = []

    for checkout_item in request.items:
        db_item = db.get(Item, checkout_item.item_id, with_for_update=True)
        if db_item is None:
            raise ItemNotFoundError(checkout_item.item_id)
        if db_item.stock < checkout_item.quantity:
            raise StockConflictError(db_item.name, checkout_item.quantity, db_item.stock)
        db_item.stock -= checkout_item.quantity
        receipt_lines.append(
            ReceiptLineItem(
                name=db_item.name,
                unit_price=db_item.price,
                quantity=checkout_item.quantity,
                line_total=db_item.price * checkout_item.quantity,
            )
        )

    db.commit()

    grand_total = sum(line.line_total for line in receipt_lines)
    return CheckoutResponse(
        customer_name=request.customer_name,
        items=receipt_lines,
        grand_total=grand_total,
    )
