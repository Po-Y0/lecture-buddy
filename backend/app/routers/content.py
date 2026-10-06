from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import String, cast, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Course, Note, Source, User
from backend.app.schemas import CourseCreate, CourseUpdate, NoteCreate, NoteUpdate
from backend.app.security import get_current_user
from backend.app.services.documents import read_and_store

router = APIRouter(prefix="/api", tags=["learning content"])


def timestamp_ms(value: datetime | None) -> int | None:
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return int(value.timestamp() * 1000)


def course_data(course: Course) -> dict:
    return {
        "id": course.id,
        "name": course.name,
        "color": course.color,
        "icon": course.icon,
        "createdAt": timestamp_ms(course.created_at),
        "updatedAt": timestamp_ms(course.updated_at),
    }


def note_data(note: Note) -> dict:
    return {
        "id": note.id,
        "courseId": note.course_id,
        "title": note.title,
        "content": note.content,
        "tags": note.tags,
        "pinned": note.pinned,
        "createdAt": timestamp_ms(note.created_at),
        "updatedAt": timestamp_ms(note.updated_at),
        "lastReviewedAt": timestamp_ms(note.last_reviewed_at),
    }


def source_data(source: Source) -> dict:
    return {
        "id": source.id,
        "courseId": source.course_id,
        "name": source.name,
        "size": source.size,
        "type": source.mime_type,
        "addedAt": timestamp_ms(source.uploaded_at),
        "extractionStatus": source.extraction_status,
    }


def owned_course(db: Session, course_id: str, user_id: str) -> Course:
    course = db.scalar(
        select(Course).where(Course.id == course_id, Course.owner_id == user_id)
    )
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.get("/courses")
def list_courses(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    courses = db.scalars(
        select(Course).where(Course.owner_id == user.id).order_by(Course.created_at)
    ).all()
    return [course_data(course) for course in courses]


@router.post("/courses", status_code=status.HTTP_201_CREATED)
def create_course(
    payload: CourseCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = Course(owner_id=user.id, **payload.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course_data(course)


@router.patch("/courses/{course_id}")
def update_course(
    course_id: str,
    payload: CourseUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = owned_course(db, course_id, user.id)
    updates = payload.model_dump(exclude_unset=True)
    if (
        "name" in updates
        and updates["name"] is not None
        and not updates["name"].strip()
    ):
        raise HTTPException(status_code=422, detail="Course name cannot be empty")
    for field, value in updates.items():
        if value is not None:
            setattr(course, field, value)
    course.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(course)
    return course_data(course)


@router.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    course = owned_course(db, course_id, user.id)
    for source in course.sources:
        Path(source.storage_path).unlink(missing_ok=True)
    db.delete(course)
    db.commit()


@router.get("/notes")
def list_notes(
    course_id: str | None = Query(default=None, alias="courseId"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = select(Note).join(Course).where(Course.owner_id == user.id)
    if course_id:
        query = query.where(Note.course_id == course_id)
    notes = db.scalars(query.order_by(Note.updated_at.desc())).all()
    return [note_data(note) for note in notes]


@router.post("/courses/{course_id}/notes", status_code=status.HTTP_201_CREATED)
def create_note(
    course_id: str,
    payload: NoteCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    owned_course(db, course_id, user.id)
    note = Note(course_id=course_id, **payload.model_dump())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note_data(note)


@router.patch("/notes/{note_id}")
def update_note(
    note_id: str,
    payload: NoteUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.scalar(
        select(Note).join(Course).where(Note.id == note_id, Course.owner_id == user.id)
    )
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    updates = payload.model_dump(exclude_unset=True)
    if "last_reviewed_at" in updates:
        value = updates.pop("last_reviewed_at")
        note.last_reviewed_at = (
            datetime.fromtimestamp(value / 1000, timezone.utc)
            if value is not None
            else None
        )
    for field, value in updates.items():
        if value is not None:
            setattr(note, field, value)
    note.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(note)
    return note_data(note)


@router.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    note = db.scalar(
        select(Note).join(Course).where(Note.id == note_id, Course.owner_id == user.id)
    )
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()


@router.get("/sources")
def list_sources(
    course_id: str | None = Query(default=None, alias="courseId"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = select(Source).join(Course).where(Course.owner_id == user.id)
    if course_id:
        query = query.where(Source.course_id == course_id)
    sources = db.scalars(query.order_by(Source.uploaded_at.desc())).all()
    return [source_data(source) for source in sources]


@router.post(
    "/courses/{course_id}/sources",
    status_code=status.HTTP_201_CREATED,
)
async def upload_source(
    course_id: str,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    owned_course(db, course_id, user.id)
    data = await read_and_store(file, user.id)
    source = Source(course_id=course_id, **data)
    db.add(source)
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        Path(source.storage_path).unlink(missing_ok=True)
        raise
    db.refresh(source)
    return source_data(source)


@router.get("/sources/{source_id}/download")
def download_source(
    source_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    source = db.scalar(
        select(Source)
        .join(Course)
        .where(Source.id == source_id, Course.owner_id == user.id)
    )
    if source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    path = Path(source.storage_path)
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Source file is unavailable")
    return FileResponse(path, media_type=source.mime_type, filename=source.name)


@router.delete("/sources/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_source(
    source_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    source = db.scalar(
        select(Source)
        .join(Course)
        .where(Source.id == source_id, Course.owner_id == user.id)
    )
    if source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    Path(source.storage_path).unlink(missing_ok=True)
    db.delete(source)
    db.commit()


@router.get("/search")
def search(
    q: str = Query(min_length=1, max_length=120),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    term = q.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    if not term:
        return []
    pattern = f"%{term}%"
    courses = db.scalars(
        select(Course).where(
            Course.owner_id == user.id, Course.name.ilike(pattern, escape="\\")
        )
    ).all()
    results = [
        {
            "key": f"c-{course.id}",
            "type": "Course",
            "title": course.name,
            "detail": "",
            "courseId": course.id,
        }
        for course in courses
    ]
    notes = db.scalars(
        select(Note)
        .join(Course)
        .where(
            Course.owner_id == user.id,
            or_(
                Note.title.ilike(pattern, escape="\\"),
                Note.content.ilike(pattern, escape="\\"),
                cast(Note.tags, String).ilike(pattern, escape="\\"),
            ),
        )
    ).all()
    course_names = {
        course.id: course.name
        for course in db.scalars(select(Course).where(Course.owner_id == user.id)).all()
    }
    results.extend(
        {
            "key": f"n-{note.id}",
            "type": "Note",
            "title": note.title,
            "detail": course_names.get(note.course_id, ""),
            "courseId": note.course_id,
        }
        for note in notes
    )
    sources = db.scalars(
        select(Source)
        .join(Course)
        .where(Course.owner_id == user.id, Source.name.ilike(pattern, escape="\\"))
    ).all()
    results.extend(
        {
            "key": f"s-{source.id}",
            "type": "File",
            "title": source.name,
            "detail": course_names.get(source.course_id, ""),
            "courseId": source.course_id,
        }
        for source in sources
    )
    return results[:20]
