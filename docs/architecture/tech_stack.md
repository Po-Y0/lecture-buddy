# Technology Stack Selection & Rationale

| Layer | Choice | Rationale | Alternative |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Vite | Render และ HMR รวดเร็ว เหมาะกับการทำ SPA เพื่อแสดงผลสรุปและแบบทดสอบแบบ interactive | Vue.js / Svelte |
| **Backend** | FastAPI (Python) | รองรับ Asynchronous ประสิทธิภาพสูง เหมาะแก่การต่อเชื่อมและรอ Response จาก AI Service | Node.js / Go |
| **Database** | PostgreSQL | มีโครงสร้างความสัมพันธ์ของข้อมูลชัดเจน และรองรับ JSONB สำหรับจัดเก็บ Data จาก AI | MongoDB / MySQL |
| **AI Integration** | OpenAI-compatible API | ใช้ Chat Completions API สำหรับสรุปและสร้างแบบทดสอบ โดยกำหนด Key, Base URL และ Model ผ่าน Environment Variables | Gemini API / Claude API / Self-hosted LLM |
| **Hosting & Infra** | Docker + Render | จัดเตรียม Environment สะดวก มี Free Tier สำหรับจัดส่ง Demo โปรเจกต์ในชั้นเรียน | Fly.io / AWS ECS |

### Backend implementation notes

- FastAPI endpoints are under `/api`; PostgreSQL schema is managed with Alembic.
- Authentication uses an `HttpOnly` cookie and a 30-minute sliding inactivity timeout. Course content and uploaded files are owner-scoped.
- Development uploads use private local filesystem storage with a 20 MiB per-file limit. OCR for scanned PDFs is not included.
- Configure AI credentials and deployment secrets outside source control. See [`backend/README.md`](../../backend/README.md).