# Backend setup and API

The API is implemented in `backend/app` with FastAPI, SQLAlchemy, Alembic, and PostgreSQL. It uses a server-side opaque session token in an `HttpOnly`, `SameSite=Lax` cookie. Session activity slides on authenticated requests and expires after 30 minutes of inactivity. Set `SESSION_COOKIE_SECURE=true` behind HTTPS in production.

## Local setup

Install Python dependencies, start PostgreSQL, and copy `.env.example` to `.env`:

```sh
python3 -m pip install -r requirements.txt
docker compose up -d db
python3 -m alembic -c backend/alembic.ini upgrade head
python3 -m uvicorn backend.app.main:app --reload --port 8000
```

Run the frontend with `npm run dev`; Vite proxies `/api` to port 8000. Override `API_PROXY_TARGET` for another backend address or `VITE_API_BASE_URL` when the frontend must call a different API base path.

For an all-container development setup, `docker compose up --build api` starts PostgreSQL and the API, applies migrations, and stores uploads in the persistent `lecture_buddy_uploads` volume. Compose database credentials are for local development only.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | local PostgreSQL URL | SQLAlchemy connection URL; tests use isolated SQLite |
| `WEB_ORIGIN` | `http://localhost:5173` | Exact allowed browser origin for CORS and unsafe-request origin checks |
| `SESSION_COOKIE_NAME` | `lecture_buddy_session` | Session cookie name |
| `SESSION_COOKIE_SECURE` | `false` | Enable only when served over HTTPS |
| `SESSION_IDLE_TIMEOUT_SECONDS` | `1800` | Sliding idle timeout |
| `UPLOAD_DIR` | `./data/uploads` | Private local directory for uploaded files |
| `MAX_UPLOAD_BYTES` | `20971520` | Per-file upload limit (20 MiB) |
| `OPENAI_API_KEY` | unset | Required for live AI features |
| `OPENAI_BASE_URL` | OpenAI default | Optional OpenAI-compatible API base URL |
| `OPENAI_MODEL` | `gpt-4o-mini` | Chat completions model |
| `AI_TIMEOUT_SECONDS` | `45` | Provider request timeout |
| `MAX_AI_INPUT_CHARACTERS` | `60000` | Bounded source content supplied to AI |

Do not commit `.env` or production credentials. Without an AI key, AI routes return HTTP 503 with a configuration message; there is no sample-content fallback.

## Migrations

Apply or inspect schema changes with:

```sh
python3 -m alembic -c backend/alembic.ini upgrade head
python3 -m alembic -c backend/alembic.ini current
```

When models change, create and inspect a migration before applying it:

```sh
python3 -m alembic -c backend/alembic.ini revision --autogenerate -m "describe schema change"
```

## API routes

All routes are under `/api`. Request validation and errors use FastAPI JSON responses (`{"detail": ...}`). Course/note/source/quiz queries are always scoped to the authenticated user; inaccessible IDs return 404.

| Method and path | Purpose |
| --- | --- |
| `POST /auth/register` | Create an account; password must be at least 8 characters and contain a letter and digit |
| `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Start/end a session and return the current user |
| `GET /courses`, `POST /courses`, `PATCH /courses/{id}`, `DELETE /courses/{id}` | Course CRUD |
| `GET /notes?courseId=...`, `POST /courses/{id}/notes`, `PATCH /notes/{id}`, `DELETE /notes/{id}` | Note CRUD, including pin and review timestamps |
| `GET /sources?courseId=...`, `POST /courses/{id}/sources` | List or upload a `file` multipart part |
| `GET /sources/{id}/download`, `DELETE /sources/{id}` | Download or remove an owned upload |
| `GET /search?q=...` | Search owned courses, notes, tags, and source names; returns up to 20 matches |
| `POST /courses/{id}/summarize` | Summarize extracted course notes and documents; returns `{summary}` |
| `POST /courses/{id}/quiz` | Generate a persisted quiz with `{count}` from 10 to 100 in increments of 10 |
| `POST /quizzes/{id}/attempts` | Submit `{answers:[{questionId,answerIndex}]}`; score is computed and persisted server-side |
| `GET /quiz-attempts` | Return the signed-in user's persisted quiz results |
| `GET /health` | Check API and database availability |

Timestamps returned to the existing React app are Unix milliseconds. Quiz responses contain the question answer index and explanation because the current quiz UI displays correctness immediately; submitted scores are nevertheless recomputed from persisted questions.

## Upload and AI limits

Supported formats are PDF, DOCX, PPTX, TXT, and MD. MIME type and extension are checked, office archives are size-bounded, and extracted text is capped at five million characters. Image-only PDFs return a clear 422 response because OCR is out of scope. Uploaded files are private, stored outside the public web root, and their extracted text is stored with source metadata in PostgreSQL.

The default storage is local filesystem storage, suitable for development and a single persistent-volume deployment. For production, configure durable storage/backup and HTTPS at the deployment layer before scaling to multiple API instances. AI input is truncated with an explicit marker to the configured character limit. Provider outages and invalid AI responses return errors instead of sample data.

The repository requirements also describe lesson management, simplified explanations, review checklists, and AI study recommendations. The current frontend has no corresponding screens or contracts, so those product flows are not represented by this API. Review scheduling currently operates on notes, matching the existing Review Center.

## Tests

```sh
python3 -m ruff check backend
python3 -m pytest backend/tests -q
```

The integration suite uses an isolated in-memory SQLite database and mocked AI responses. No live PostgreSQL server or OpenAI credentials are required for tests.
