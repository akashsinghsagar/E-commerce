from decimal import Decimal
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from .deps import admin_customer, current_customer
from .models import Address, Cart, CartItem, Category, Customer, Order, OrderItem, Product
from .schemas import (
    AddressCreate,
    AddressRead,
    CategoryCreate,
    CategoryRead,
    CartItemRequest,
    CartItemRead,
    CartRead,
    CustomerRead,
    LoginRequest,
    OrderCreate,
    OrderRead,
    ProductCreate,
    ProductRead,
    RegisterRequest,
    TokenResponse,
)
from .security import create_access_token, hash_password, verify_password

app = FastAPI(title="LADDI API", version="1.0.0", description="LADDI commerce API. Configure PostgreSQL and JWT secrets before deployment.")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/auth/register", response_model=TokenResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if db.scalar(select(Customer).where(Customer.email == payload.email.lower())):
        raise HTTPException(status_code=409, detail="Email is already registered")
    customer = Customer(email=payload.email.lower(), full_name=payload.full_name, phone=payload.phone, password_hash=hash_password(payload.password))
    db.add(customer)
    try:
        db.commit()
        db.refresh(customer)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email is already registered") from exc
    return TokenResponse(access_token=create_access_token(str(customer.id), customer.is_admin))


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    customer = db.scalar(select(Customer).where(Customer.email == payload.email.lower()))
    if customer is None or not verify_password(payload.password, customer.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(access_token=create_access_token(str(customer.id), customer.is_admin))


@app.get("/api/categories", response_model=list[CategoryRead])
def categories(db: Session = Depends(get_db)) -> list[Category]:
    return list(db.scalars(select(Category).where(Category.is_active.is_(True)).order_by(Category.name)))


@app.post("/api/categories", response_model=CategoryRead, status_code=201)
def create_category(payload: CategoryCreate, _: Customer = Depends(admin_customer), db: Session = Depends(get_db)) -> Category:
    category = Category(**payload.model_dump())
    db.add(category)
    try:
        db.commit()
        db.refresh(category)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Category name or slug already exists") from exc
    return category


@app.get("/api/products", response_model=list[ProductRead])
def products(search: str | None = None, category_id: int | None = Query(default=None, gt=0), db: Session = Depends(get_db)) -> list[Product]:
    query = select(Product).where(Product.is_active.is_(True))
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    if category_id:
        query = query.where(Product.category_id == category_id)
    return list(db.scalars(query.order_by(Product.name)))


@app.post("/api/products", response_model=ProductRead, status_code=201)
def create_product(payload: ProductCreate, _: Customer = Depends(admin_customer), db: Session = Depends(get_db)) -> Product:
    product = Product(**payload.model_dump(exclude={"sizes", "colors"}), sizes=",".join(payload.sizes), colors=",".join(payload.colors))
    if product.original_price is not None and product.original_price < product.price:
        raise HTTPException(status_code=422, detail="Original price cannot be lower than price")
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@app.get("/api/products/{product_id}", response_model=ProductRead)
def product(product_id: int, db: Session = Depends(get_db)) -> Product:
    item = db.scalar(select(Product).where(Product.id == product_id, Product.is_active.is_(True)))
    if item is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return item


@app.get("/api/inventory", response_model=list[ProductRead])
def inventory(_: Customer = Depends(admin_customer), db: Session = Depends(get_db)) -> list[Product]:
    return list(db.scalars(select(Product).order_by(Product.stock_quantity)))


@app.patch("/api/products/{product_id}", response_model=ProductRead)
def update_product(product_id: int, payload: ProductCreate, _: Customer = Depends(admin_customer), db: Session = Depends(get_db)) -> Product:
    item = db.get(Product, product_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in payload.model_dump(exclude={"sizes", "colors"}).items():
        setattr(item, key, value)
    item.sizes = ",".join(payload.sizes)
    item.colors = ",".join(payload.colors)
    db.commit()
    db.refresh(item)
    return item


@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: int, _: Customer = Depends(admin_customer), db: Session = Depends(get_db)) -> None:
    item = db.get(Product, product_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Product not found")
    item.is_active = False
    db.commit()


@app.get("/api/admin/customers", response_model=list[CustomerRead])
def admin_customers(_: Customer = Depends(admin_customer), db: Session = Depends(get_db)) -> list[Customer]:
    return list(db.scalars(select(Customer).order_by(Customer.created_at.desc())))


@app.get("/api/cart", response_model=CartRead)
def get_cart(customer: Customer = Depends(current_customer), db: Session = Depends(get_db)) -> CartRead:
    cart = db.scalar(select(Cart).where(Cart.customer_id == customer.id))
    if cart is None:
        return CartRead(items=[], subtotal=Decimal("0"))
    items = [CartItemRead(product_id=item.product_id, quantity=item.quantity, unit_price=item.unit_price) for item in cart.items]
    return CartRead(items=items, subtotal=sum((item.unit_price * item.quantity for item in cart.items), Decimal("0")))


@app.put("/api/cart/items", response_model=CartRead)
def upsert_cart_item(payload: CartItemRequest, customer: Customer = Depends(current_customer), db: Session = Depends(get_db)) -> CartRead:
    product = db.scalar(select(Product).where(Product.id == payload.product_id, Product.is_active.is_(True)))
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if payload.quantity > product.stock_quantity:
        raise HTTPException(status_code=409, detail="Requested quantity exceeds available stock")
    cart = db.scalar(select(Cart).where(Cart.customer_id == customer.id))
    if cart is None:
        cart = Cart(customer_id=customer.id)
        db.add(cart)
        db.flush()
    item = next((entry for entry in cart.items if entry.product_id == payload.product_id), None)
    if item is None:
        cart.items.append(CartItem(product_id=product.id, quantity=payload.quantity, unit_price=product.price))
    else:
        item.quantity = payload.quantity
        item.unit_price = product.price
    db.commit()
    return get_cart(customer, db)


@app.delete("/api/cart/items/{product_id}", response_model=CartRead)
def remove_cart_item(product_id: int, customer: Customer = Depends(current_customer), db: Session = Depends(get_db)) -> CartRead:
    cart = db.scalar(select(Cart).where(Cart.customer_id == customer.id))
    if cart is not None:
        cart.items = [item for item in cart.items if item.product_id != product_id]
        db.commit()
    return get_cart(customer, db)


@app.get("/api/account/addresses", response_model=list[AddressRead])
def addresses(customer: Customer = Depends(current_customer)) -> list[Address]:
    return customer.addresses


@app.post("/api/account/addresses", response_model=AddressRead, status_code=201)
def add_address(payload: AddressCreate, customer: Customer = Depends(current_customer), db: Session = Depends(get_db)) -> Address:
    if payload.is_default:
        for address in customer.addresses:
            address.is_default = False
    address = Address(customer_id=customer.id, **payload.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@app.get("/api/orders", response_model=list[OrderRead])
def customer_orders(customer: Customer = Depends(current_customer), db: Session = Depends(get_db)) -> list[Order]:
    return list(db.scalars(select(Order).where(Order.customer_id == customer.id).order_by(Order.created_at.desc())))


@app.post("/api/orders", response_model=OrderRead, status_code=201)
def create_order(payload: OrderCreate, customer: Customer = Depends(current_customer), db: Session = Depends(get_db)) -> Order:
    address = db.scalar(select(Address).where(Address.id == payload.address_id, Address.customer_id == customer.id))
    if address is None:
        raise HTTPException(status_code=422, detail="Address does not belong to this customer")
    subtotal = Decimal("0")
    order_items: list[OrderItem] = []
    for request_item in payload.items:
        item = db.get(Product, request_item.product_id)
        if item is None or not item.is_active:
            raise HTTPException(status_code=404, detail=f"Product {request_item.product_id} not found")
        if request_item.quantity > item.stock_quantity:
            raise HTTPException(status_code=409, detail=f"Insufficient stock for {item.name}")
        subtotal += item.price * request_item.quantity
        order_items.append(OrderItem(product_id=item.id, name=item.name, size=request_item.size, color=request_item.color, quantity=request_item.quantity, unit_price=item.price))
    shipping = Decimal("0") if subtotal >= 999 else Decimal("99")
    discount = (subtotal * Decimal("0.1")).quantize(Decimal("0.01")) if subtotal >= 5000 else Decimal("0")
    order = Order(order_number=f"LDI-{uuid4().hex[:10].upper()}", customer_id=customer.id, subtotal=subtotal, shipping=shipping, discount=discount, total=subtotal + shipping - discount, items=order_items)
    db.add(order)
    for request_item in payload.items:
        item = db.get(Product, request_item.product_id)
        assert item is not None
        item.stock_quantity -= request_item.quantity
    db.commit()
    db.refresh(order)
    return order


@app.patch("/api/admin/orders/{order_id}/status", response_model=OrderRead)
def update_order_status(order_id: int, order_status: str = Query(..., min_length=3, max_length=40), _: Customer = Depends(admin_customer), db: Session = Depends(get_db)) -> Order:
    allowed = {"pending", "confirmed", "packed", "shipped", "delivered", "cancelled"}
    if order_status not in allowed:
        raise HTTPException(status_code=422, detail="Unsupported order status")
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = order_status
    db.commit()
    db.refresh(order)
    return order
