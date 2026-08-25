# Technology Stack Selection & Rationale

| Layer | Choice | Rationale | Alternative |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Vite | Render และ HMR รวดเร็ว เหมาะกับการทำ SPA เพื่อแสดงผลสรุปและแบบทดสอบแบบ interactive | Vue.js / Svelte |
| **Backend** | FastAPI (Python) | รองรับ Asynchronous ประสิทธิภาพสูง เหมาะแก่การต่อเชื่อมและรอ Response จาก AI Service | Node.js / Go |
| **Database** | PostgreSQL | มีโครงสร้างความสัมพันธ์ของข้อมูลชัดเจน และรองรับ JSONB สำหรับจัดเก็บ Data จาก AI | MongoDB / MySQL |
| **AI Integration** | OpenAI API / Gemini API | มีโมเดลระดับ SOTA ที่เก่งการทำ Text Summarization และ Question Generation ภาษาไทย | Claude API / Self-hosted LLM |
| **Hosting & Infra** | Docker + Render | จัดเตรียม Environment สะดวก มี Free Tier สำหรับจัดส่ง Demo โปรเจกต์ในชั้นเรียน | Fly.io / AWS ECS |