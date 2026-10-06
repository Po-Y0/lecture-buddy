from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.app.config import get_settings
from backend.app.database import get_db
from backend.app.models import User, UserSession
from backend.app.schemas import LoginRequest, RegisterRequest
from backend.app.security import (
    _token_hash,
    clear_session_cookie,
    create_session,
    get_current_user,
    hash_password,
    set_session_cookie,
    verify_password,
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])


def user_response(user: User) -> dict[str, str]:
    return {"id": user.id, "name": user.name, "email": user.email}


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = User(
        name=payload.name,
        email=str(payload.email).lower(),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=409, detail="Email is already registered"
        ) from error
    db.refresh(user)
    return user_response(user)


@router.post("/login")
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.scalar(select(User).where(User.email == str(payload.email).lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_session(db, user)
    set_session_cookie(response, token)
    return user_response(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    request: Request,
    response: Response,
    _current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    token = request.cookies.get(get_settings().session_cookie_name)
    if token:
        session = db.scalar(
            select(UserSession).where(UserSession.token_hash == _token_hash(token))
        )
        if session is not None:
            db.delete(session)
        db.commit()
    if "set-cookie" in response.headers:
        del response.headers["set-cookie"]
    clear_session_cookie(response)


@router.get("/me")
def current_user(user: User = Depends(get_current_user)):
    return user_response(user)
