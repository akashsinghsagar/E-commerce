"""create LADDI commerce tables"""

from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("categories", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(120), nullable=False), sa.Column("slug", sa.String(140), nullable=False), sa.Column("description", sa.Text(), nullable=False), sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()), sa.UniqueConstraint("name"), sa.UniqueConstraint("slug"))
    op.create_table("products", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(180), nullable=False), sa.Column("slug", sa.String(200), nullable=False), sa.Column("description", sa.Text(), nullable=False), sa.Column("price", sa.Numeric(10, 2), nullable=False), sa.Column("original_price", sa.Numeric(10, 2)), sa.Column("image_url", sa.String(500), nullable=False), sa.Column("sizes", sa.Text(), nullable=False), sa.Column("colors", sa.Text(), nullable=False), sa.Column("stock_quantity", sa.Integer(), nullable=False), sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()), sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False), sa.UniqueConstraint("slug"))
    op.create_table("customers", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("email", sa.String(320), nullable=False), sa.Column("full_name", sa.String(160), nullable=False), sa.Column("phone", sa.String(30)), sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.false()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.UniqueConstraint("email"))
    op.create_table("addresses", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id"), nullable=False), sa.Column("full_name", sa.String(160), nullable=False), sa.Column("phone", sa.String(30), nullable=False), sa.Column("address_line1", sa.String(240), nullable=False), sa.Column("address_line2", sa.String(240)), sa.Column("city", sa.String(100), nullable=False), sa.Column("state", sa.String(100), nullable=False), sa.Column("pincode", sa.String(6), nullable=False), sa.Column("is_default", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.create_table("carts", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id"), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.UniqueConstraint("customer_id"))
    op.create_table("cart_items", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("cart_id", sa.Integer(), sa.ForeignKey("carts.id"), nullable=False), sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False), sa.Column("quantity", sa.Integer(), nullable=False), sa.Column("unit_price", sa.Numeric(10, 2), nullable=False))
    op.create_table("orders", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("order_number", sa.String(40), nullable=False), sa.Column("customer_id", sa.Integer(), sa.ForeignKey("customers.id"), nullable=False), sa.Column("status", sa.String(40), nullable=False), sa.Column("subtotal", sa.Numeric(10, 2), nullable=False), sa.Column("shipping", sa.Numeric(10, 2), nullable=False), sa.Column("discount", sa.Numeric(10, 2), nullable=False), sa.Column("total", sa.Numeric(10, 2), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.UniqueConstraint("order_number"))
    op.create_table("order_items", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("order_id", sa.Integer(), sa.ForeignKey("orders.id"), nullable=False), sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False), sa.Column("name", sa.String(180), nullable=False), sa.Column("size", sa.String(30), nullable=False), sa.Column("color", sa.String(80), nullable=False), sa.Column("quantity", sa.Integer(), nullable=False), sa.Column("unit_price", sa.Numeric(10, 2), nullable=False))


def downgrade() -> None:
    for table in ("order_items", "orders", "cart_items", "carts", "addresses", "customers", "products", "categories"):
        op.drop_table(table)
