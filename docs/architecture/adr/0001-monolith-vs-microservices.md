# ADR 0001: ใช้ RESTful API สำหรับการสื่อสารระหว่าง Frontend และ Backend

## Status
Accepted

## Context
- ระบบ Lecture Buddy ประกอบด้วย Frontend Web App (React + Vite) และ Backend API (FastAPI)
- ต้องการโปรโตคอลการสื่อสารที่เป็นมาตรฐาน เข้าใจง่าย และทีมสามารถพัฒนาร่วมกันได้รวดเร็วภายในระยะเวลาโปรเจกต์
- ทีมพัฒนามีความคุ้นเคยกับการรับส่งข้อมูลผ่าน HTTP และ JSON อยู่แล้ว

## Decision
เลือกใช้ **RESTful APIs (HTTP/JSON)** เป็นโปรโตคอลหลักในการสื่อสารแบบ synchronous ระหว่าง Frontend Web App และ Backend API โดยมีการกำหนดนิยามโครงสร้างข้อมูล API ผ่าน OpenAPI (Swagger) Specification

## Consequences
- **Positive (✅):**
  - เรียนรู้และพัฒนาง่ายเนื่องจากทีมมีทักษะด้าน HTTP/JSON อยู่แล้ว
  - ทดสอบและสร้าง Mock Data ได้ง่ายด้วยเครื่องมือมาตรฐาน เช่น Postman หรือ Swagger UI
  - มีไลบรารีรองรับทั้งในฝั่ง React และ FastAPI ทำให้การพัฒนาทำได้รวดเร็ว
- **Negative (❌):**
  - ประสิทธิภาพและ Latency อาจสูงกว่าโปรโตคอล Binary (เช่น gRPC) เล็กน้อย
  - ต้องตรวจสอบ Schema ความถูกต้องของชนิดข้อมูลระหว่าง Client-Server ด้วยตนเอง

## Alternatives Considered
- **gRPC:** rejected — แม้จะส่งข้อมูลได้เร็วกว่า แต่มีความซับซ้อนและมี Learning Curve สูงเกินไปสำหรับเวลาพัฒนาที่มีจำกัด
- **GraphQL:** rejected — เพิ่ม Overhead ในการตั้งค่าคิวรีที่เกินความจำเป็นสำหรับ MVP ของระบบ Lecture Buddy