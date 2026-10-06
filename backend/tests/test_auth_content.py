import hashlib
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from backend.app.config import get_settings
from backend.app.models import UserSession


def register_and_login(client, email="student@example.com"):
    registered = client.post(
        "/api/auth/register",
        json={"name": "Student", "email": email, "password": "safePassword1"},
    )
    assert registered.status_code == 201
    assert "password" not in registered.json()
    logged_in = client.post(
        "/api/auth/login",
        json={"email": email, "password": "safePassword1"},
    )
    assert logged_in.status_code == 200
    return logged_in.json()


def test_registration_validates_password_and_normalizes_email(client):
    weak = client.post(
        "/api/auth/register",
        json={"name": "Student", "email": "weak@example.com", "password": "allletters"},
    )
    assert weak.status_code == 422
    assert "allletters" not in weak.text

    user = register_and_login(client, "Student@Example.com")
    assert user["email"] == "student@example.com"
    duplicate = client.post(
        "/api/auth/register",
        json={
            "name": "Another",
            "email": "student@example.com",
            "password": "safePassword1",
        },
    )
    assert duplicate.status_code == 409


def test_authentication_session_and_logout(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Student",
            "email": "student@example.com",
            "password": "safePassword1",
        },
    )
    bad_login = client.post(
        "/api/auth/login",
        json={"email": "student@example.com", "password": "wrongPassword1"},
    )
    assert bad_login.status_code == 401
    assert client.get("/api/auth/me").status_code == 401

    user = client.post(
        "/api/auth/login",
        json={"email": "student@example.com", "password": "safePassword1"},
    ).json()
    assert client.get("/api/auth/me").json() == user
    assert client.post("/api/auth/logout").status_code == 204
    assert client.cookies.get(get_settings().session_cookie_name) is None
    assert client.get("/api/auth/me").status_code == 401


def test_idle_session_expires_after_thirty_minutes(client):
    register_and_login(client)
    token = client.cookies.get(get_settings().session_cookie_name)
    digest = hashlib.sha256(token.encode()).hexdigest()
    with client.app.state.test_session_local() as db:
        session = db.scalar(select(UserSession).where(UserSession.token_hash == digest))
        session.last_activity_at = datetime.now(timezone.utc) - timedelta(minutes=31)
        db.commit()

    assert client.get("/api/auth/me").status_code == 401


def test_course_note_crud_and_search_are_owner_scoped(client):
    register_and_login(client)
    course = client.post(
        "/api/courses",
        json={"name": "Software Engineering", "icon": "📘", "color": "#4c1d95"},
    )
    assert course.status_code == 201
    course_id = course.json()["id"]
    note = client.post(
        f"/api/courses/{course_id}/notes",
        json={
            "title": "Scrum ceremony",
            "content": "Sprint planning notes",
            "tags": ["agile"],
        },
    )
    assert note.status_code == 201
    note_id = note.json()["id"]
    reviewed_at = 1_800_000_000_000

    updated = client.patch(
        f"/api/notes/{note_id}",
        json={"pinned": True, "lastReviewedAt": reviewed_at},
    )
    assert updated.status_code == 200
    assert updated.json()["pinned"] is True
    assert updated.json()["lastReviewedAt"] == reviewed_at
    assert (
        client.get("/api/search", params={"q": "agile"}).json()[0]["key"]
        == f"n-{note_id}"
    )

    client.post(
        "/api/auth/register",
        json={
            "name": "Other",
            "email": "other@example.com",
            "password": "safePassword2",
        },
    )
    client.cookies.clear()
    client.post(
        "/api/auth/login",
        json={"email": "other@example.com", "password": "safePassword2"},
    )
    assert client.get("/api/courses").json() == []
    assert (
        client.patch(f"/api/notes/{note_id}", json={"pinned": False}).status_code == 404
    )
    assert client.delete(f"/api/courses/{course_id}").status_code == 404


def test_course_deletion_cascades_owned_notes(client):
    register_and_login(client)
    course = client.post("/api/courses", json={"name": "Calculus"}).json()
    client.post(
        f"/api/courses/{course['id']}/notes",
        json={"title": "Limits", "content": "Definitions"},
    ).json()
    assert client.delete(f"/api/courses/{course['id']}").status_code == 204
    assert client.get("/api/notes").json() == []
    assert client.get("/api/courses").json() == []


def test_mutating_request_rejects_untrusted_origin(client):
    response = client.post(
        "/api/auth/register",
        headers={"Origin": "https://attacker.example"},
        json={
            "name": "Student",
            "email": "student@example.com",
            "password": "safePassword1",
        },
    )
    assert response.status_code == 403
