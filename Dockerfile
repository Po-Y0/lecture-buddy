FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/data/uploads && chown -R nobody:nogroup /app/data

EXPOSE 8000

USER nobody

CMD ["sh", "-c", "python -m alembic -c backend/alembic.ini upgrade head && exec uvicorn backend.app.main:app --host 0.0.0.0 --port \"${PORT:-8000}\""]
