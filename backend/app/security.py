import hashlib
import secrets
from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Request, Response, status
from pwdlib import PasswordHash
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from backend.app.config import get_settings
from backend.app.database import get_db
from backend.app.models import User, UserSession

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, encoded: str) -> bool:
    return password_hash.verify(password, encoded)


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _utc(value: datetime) -> datetime:
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value


def create_session(db: Session, user: User) -> str:
    token = secrets.token_urlsafe(32)
    now = datetime.now(timezone.utc)
    expired_before = now.timestamp() - get_settings().session_idle_timeout_seconds
    db.execute(
        delete(UserSession).where(
            UserSession.last_activity_at
            < datetime.fromtimestamp(expired_before, timezone.utc)
        )
    )
    db.add(
        UserSession(
            user_id=user.id,
            token_hash=_token_hash(token),
            last_activity_at=now,
        )
    )
    db.commit()
    return token


def set_session_cookie(response: Response, token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        max_age=settings.session_idle_timeout_seconds,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        path="/api",
    )


def clear_session_cookie(response: Response) -> None:
    response.set_cookie(
        key=get_settings().session_cookie_name,
        value="",
        max_age=0,
        expires="Thu, 01 Jan 1970 00:00:00 GMT",
        path="/api",
        httponly=True,
        secure=get_settings().session_cookie_secure,
        samesite="lax",
    )


def get_current_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> User:
    settings = get_settings()
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required"
        )

    active_session = db.scalar(
        select(UserSession).where(UserSession.token_hash == _token_hash(token))
    )
    if active_session is None:
        clear_session_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired"
        )

    now = datetime.now(timezone.utc)
    last_activity = _utc(active_session.last_activity_at)
    if (now - last_activity).total_seconds() >= settings.session_idle_timeout_seconds:
        db.delete(active_session)
        db.commit()
        clear_session_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired"
        )

    active_session.last_activity_at = now
    db.commit()
    set_session_cookie(response, token)
    return active_session.user
