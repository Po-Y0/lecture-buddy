from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(part.capitalize() for part in rest)


class APIModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class RegisterRequest(APIModel):
    name: Annotated[str, Field(min_length=1, max_length=100)]
    email: EmailStr
    password: Annotated[str, Field(min_length=8, max_length=128)]

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Name cannot be empty")
        return value.strip()

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).lower()

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if not any(char.isalpha() for char in value) or not any(
            char.isdigit() for char in value
        ):
            raise ValueError("Password must contain at least one letter and one number")
        return value


class LoginRequest(APIModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=1, max_length=128)]

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).lower()


class CourseCreate(APIModel):
    name: Annotated[str, Field(min_length=1, max_length=160)]
    color: Annotated[str, Field(pattern=r"^#[0-9a-fA-F]{6}$")] = "#4c1d95"
    icon: Annotated[str, Field(min_length=1, max_length=32)] = "📘"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Course name cannot be empty")
        return value.strip()


class CourseUpdate(APIModel):
    name: Annotated[str, Field(min_length=1, max_length=160)] | None = None
    color: Annotated[str, Field(pattern=r"^#[0-9a-fA-F]{6}$")] | None = None
    icon: Annotated[str, Field(min_length=1, max_length=32)] | None = None

    @field_validator("name")
    @classmethod
    def trim_name(cls, value: str | None) -> str | None:
        if value is not None:
            if not value.strip():
                raise ValueError("Course name cannot be empty")
            return value.strip()
        return value


class NoteCreate(APIModel):
    title: Annotated[str, Field(min_length=1, max_length=300)]
    content: Annotated[str, Field(max_length=200_000)] = ""
    tags: Annotated[list[str], Field(max_length=30)] = Field(default_factory=list)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Note title cannot be empty")
        return value.strip()

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, values: list[str]) -> list[str]:
        return list(
            dict.fromkeys(
                tag.strip().lower().removeprefix("#") for tag in values if tag.strip()
            )
        )


class NoteUpdate(APIModel):
    title: Annotated[str, Field(min_length=1, max_length=300)] | None = None
    content: Annotated[str, Field(max_length=200_000)] | None = None
    tags: Annotated[list[str], Field(max_length=30)] | None = None
    pinned: bool | None = None
    last_reviewed_at: Annotated[int, Field(ge=0)] | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("Note title cannot be empty")
        return value.strip() if value is not None else None

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, values: list[str] | None) -> list[str] | None:
        if values is None:
            return None
        return list(
            dict.fromkeys(
                tag.strip().lower().removeprefix("#") for tag in values if tag.strip()
            )
        )


class QuizRequest(APIModel):
    count: Annotated[int, Field(ge=10, le=100, multiple_of=10)] = 10


class QuizAnswer(APIModel):
    question_id: Annotated[str, Field(min_length=1, max_length=36)]
    answer_index: Annotated[int, Field(ge=0, le=3)]


class QuizAttemptRequest(APIModel):
    answers: Annotated[list[QuizAnswer], Field(min_length=1, max_length=100)]
