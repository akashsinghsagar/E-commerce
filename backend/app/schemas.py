from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class CategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: str = Field(pattern=r"^[a-z0-9-]+$")
    description: str = ""


class CategoryRead(CategoryCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=180)
    slug: str = Field(pattern=r"^[a-z0-9-]+$")
    description: str = Field(min_length=1)
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    original_price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    image_url: str = ""
    sizes: list[str] = Field(default_factory=list, max_length=20)
    colors: list[str] = Field(default_factory=list, max_length=20)
    stock_quantity: int = Field(ge=0)
    category_id: int = Field(gt=0)

    @field_validator("original_price")
    @classmethod
    def original_price_not_below_sale(cls, value: Decimal | None, info):
        price = info.data.get("price")
        if value is not None and price is not None and value < price:
            raise ValueError("original_price cannot be lower than price")
        return value


class ProductRead(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    price: Decimal
    original_price: Decimal | None
    image_url: str
    sizes: list[str]
    colors: list[str]
    stock_quantity: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def split_serialized_options(cls, value):
        if hasattr(value, "sizes"):
            return {
                "id": value.id,
                "name": value.name,
                "slug": value.slug,
                "description": value.description,
                "price": value.price,
                "original_price": value.original_price,
                "image_url": value.image_url,
                "sizes": value.sizes.split(",") if value.sizes else [],
                "colors": value.colors.split(",") if value.colors else [],
                "stock_quantity": value.stock_quantity,
                "is_active": value.is_active,
            }
        return value


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=160)
    phone: str | None = Field(default=None, max_length=30)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AddressCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    phone: str = Field(min_length=10, max_length=30)
    address_line1: str = Field(min_length=3, max_length=240)
    address_line2: str | None = Field(default=None, max_length=240)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pincode: str = Field(pattern=r"^\d{6}$")
    is_default: bool = False


class AddressRead(AddressCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class CartItemRequest(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0, le=20)


class CartItemRead(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal


class CartRead(BaseModel):
    items: list[CartItemRead]
    subtotal: Decimal


class CustomerRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: str | None
    is_admin: bool
    model_config = ConfigDict(from_attributes=True)


class OrderItemRequest(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0, le=20)
    size: str = Field(min_length=1, max_length=30)
    color: str = Field(min_length=1, max_length=80)


class OrderCreate(BaseModel):
    address_id: int = Field(gt=0)
    items: list[OrderItemRequest] = Field(min_length=1, max_length=50)


class OrderRead(BaseModel):
    id: int
    order_number: str
    status: str
    subtotal: Decimal
    shipping: Decimal
    discount: Decimal
    total: Decimal
    model_config = ConfigDict(from_attributes=True)
