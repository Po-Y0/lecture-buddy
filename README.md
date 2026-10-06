# Lecture Buddy

Lecture Buddy is a React + Vite study app backed by a FastAPI API and PostgreSQL. Courses, notes, uploaded materials, and quiz history are stored on the server and scoped to the signed-in student.

## Run locally

Requirements: Node.js 20+, Python 3.12+, and Docker with Compose.

```sh
npm ci
cp .env.example .env
python3 -m pip install -r requirements.txt
docker compose up -d db
python3 -m alembic -c backend/alembic.ini upgrade head
python3 -m uvicorn backend.app.main:app --reload --port 8000
```

In another terminal, run the web app:

```sh
npm run dev
```

Vite proxies `/api` to `http://127.0.0.1:8000` by default. Configure `API_PROXY_TARGET` if the API is elsewhere. Open the Vite URL, register, then sign in. The interactive API reference is at `http://localhost:8000/docs`.

To run the API and PostgreSQL in containers instead, use `docker compose up --build api`. Compose applies Alembic migrations before starting the API and keeps uploaded files in its named volume.

## Configuration and behavior

Copy `.env.example` to `.env`. The example contains development-only database settings. Set `OPENAI_API_KEY` to enable summaries and quiz generation; the backend uses an OpenAI-compatible chat completions API, configured with `OPENAI_BASE_URL` and `OPENAI_MODEL` when needed. No key is required for backend tests. Never use the example database password or disable secure cookies in production.

Uploads are limited to 20 MB per file and support text-extractable PDF, DOCX, PPTX, TXT, and MD. Files are stored under `UPLOAD_DIR`; extracted text is persisted in PostgreSQL. OCR and scanned/image-only PDFs are not supported. Back up the database and upload volume together. Browser-local data from the earlier prototype is not imported; legacy local plaintext credentials are removed when the API session is initialized.

See [backend setup and API details](backend/README.md) for routes, migrations, environment variables, and deployment notes.

## Checks

```sh
npm run lint
npm test
npm run build
python3 -m ruff check .
python3 -m pytest backend/tests src/tests -q
```
