from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Course, Note, Quiz, QuizAttempt, Source, User
from backend.app.routers.content import owned_course, timestamp_ms
from backend.app.schemas import QuizAttemptRequest, QuizRequest
from backend.app.security import get_current_user
from backend.app.services.ai import (
    AIServiceError,
    build_material,
    generate_questions,
    summarize,
)

router = APIRouter(prefix="/api", tags=["AI and review"])


def _raise_ai_error(error: AIServiceError):
    raise HTTPException(status_code=error.status_code, detail=error.detail) from error


@router.post("/courses/{course_id}/summarize")
async def summarize_course(
    course_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = owned_course(db, course_id, user.id)
    notes = db.scalars(select(Note).where(Note.course_id == course_id)).all()
    sources = db.scalars(
        select(Source).where(
            Source.course_id == course_id,
            Source.extraction_status == "ready",
        )
    ).all()
    try:
        material = build_material(course, notes, sources)
        summary = await summarize(material)
    except AIServiceError as error:
        _raise_ai_error(error)
    return {"summary": summary}


@router.post("/courses/{course_id}/quiz", status_code=201)
async def generate_course_quiz(
    course_id: str,
    payload: QuizRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = owned_course(db, course_id, user.id)
    notes = db.scalars(select(Note).where(Note.course_id == course_id)).all()
    sources = db.scalars(
        select(Source).where(
            Source.course_id == course_id,
            Source.extraction_status == "ready",
        )
    ).all()
    try:
        material = build_material(course, notes, sources)
        questions = await generate_questions(material, payload.count)
    except AIServiceError as error:
        _raise_ai_error(error)

    quiz = Quiz(course_id=course_id, questions=questions)
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return {"quizId": quiz.id, "questions": quiz.questions}


@router.post("/quizzes/{quiz_id}/attempts", status_code=201)
def save_quiz_attempt(
    quiz_id: str,
    payload: QuizAttemptRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    quiz = db.scalar(
        select(Quiz).join(Course).where(Quiz.id == quiz_id, Course.owner_id == user.id)
    )
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")

    question_by_id = {question["id"]: question for question in quiz.questions}
    answer_ids = [answer.question_id for answer in payload.answers]
    if len(set(answer_ids)) != len(answer_ids):
        raise HTTPException(
            status_code=422, detail="A question can only be answered once"
        )
    if any(question_id not in question_by_id for question_id in answer_ids):
        raise HTTPException(
            status_code=422, detail="Attempt includes an unknown question"
        )

    stored_answers = []
    score = 0
    for answer in payload.answers:
        question = question_by_id[answer.question_id]
        if answer.answer_index >= len(question["choices"]):
            raise HTTPException(
                status_code=422, detail="Selected answer is out of range"
            )
        correct = answer.answer_index == question["answerIndex"]
        score += int(correct)
        stored_answers.append(
            {
                "questionId": answer.question_id,
                "answerIndex": answer.answer_index,
                "correct": correct,
            }
        )

    attempt = QuizAttempt(
        quiz_id=quiz.id,
        answers=stored_answers,
        score=score,
        total=len(stored_answers),
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return {
        "id": attempt.id,
        "courseId": quiz.course_id,
        "score": attempt.score,
        "total": attempt.total,
        "takenAt": timestamp_ms(attempt.taken_at),
    }


@router.get("/quiz-attempts")
def list_quiz_attempts(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        select(QuizAttempt, Quiz.course_id)
        .join(Quiz)
        .join(Course)
        .where(Course.owner_id == user.id)
        .order_by(QuizAttempt.taken_at.desc())
    ).all()
    return [
        {
            "id": attempt.id,
            "courseId": course_id,
            "score": attempt.score,
            "total": attempt.total,
            "takenAt": timestamp_ms(attempt.taken_at),
        }
        for attempt, course_id in rows
    ]
