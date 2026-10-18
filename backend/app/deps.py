from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .config import get_settings
from .db import get_db
from .models import Customer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def current_customer(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Customer:
    try:
        payload = jwt.decode(token, get_settings().jwt_secret_key, algorithms=[get_settings().jwt_algorithm])
        customer_id = int(payload["sub"])
    except (JWTError, KeyError, TypeError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc
    customer = db.get(Customer, customer_id)
    if customer is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Customer not found")
    return customer


def admin_customer(customer: Customer = Depends(current_customer)) -> Customer:
    if not customer.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin authorization required")
    return customer
