from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.app.config import get_settings
from backend.app.database import get_db
from backend.app.routers import auth, content, learning

app = FastAPI(title="Lecture Buddy API", version="1.0.0")
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.web_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def validate_request_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    if (
        request.method not in {"GET", "HEAD", "OPTIONS"}
        and origin is not None
        and origin != settings.web_origin
    ):
        return JSONResponse(
            status_code=403, content={"detail": "Origin is not allowed"}
        )
    return await call_next(request)


app.include_router(auth.router)
app.include_router(content.router)
app.include_router(learning.router)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_request: Request, error: RequestValidationError):
    safe_errors = [
        {key: item[key] for key in ("loc", "msg", "type") if key in item}
        for item in error.errors()
    ]
    return JSONResponse(status_code=422, content={"detail": safe_errors})


@app.get("/api/health", tags=["health"])
def health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=503, detail="Database is unavailable"
        ) from error
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def root():
    return {"service": "Lecture Buddy API", "docs": "/docs"}
