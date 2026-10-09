# Final Reflection — [นายกิตติณัฏฐ์ ครรชิตานุรักษ์] ([67025954])

## 1. What did you build?
พัฒนา backend ของ Lecture Buddy ด้วย FastAPI, PostgreSQL และ SQLAlchemy พร้อมเชื่อมต่อกับ frontend ที่มีอยู่ ฟีเจอร์หลักประกอบด้วยสมัครสมาชิกและเข้าสู่ระบบ จัดการคอร์สและโน้ต อัปโหลดเอกสาร ค้นหา สรุปเนื้อหาด้วย AI และสร้าง quiz พร้อมบันทึกผลการทำแบบทดสอบ

หลักฐาน: [branch `kaxin78-lecture-buddy-backend`](https://github.com/Software-Engineering-Concepts-2026/se-sec1-team-03/tree/kaxin78-lecture-buddy-backend)

## 2. What problem did you solve?
แก้ข้อจำกัดที่ข้อมูลและฟีเจอร์ของแอปยังพึ่งพา frontend หรือข้อมูลจำลอง ทำให้ผู้ใช้ยังเก็บและเรียกดูข้อมูลการเรียนได้ไม่ครบถ้วน เมื่อมี backend ข้อมูลคอร์ส โน้ต เอกสาร และผล quiz จึงจัดเก็บและใช้งานต่อได้จริง

## 3. What technical decision are you proudest of?
ออกแบบ API ให้ข้อมูลคอร์ส โน้ต และ quiz ผูกกับบัญชีผู้ใช้ พร้อมใช้ session cookie และตรวจสิทธิ์ก่อนเข้าถึงข้อมูล ช่วยให้แต่ละคนเห็นเฉพาะข้อมูลของตนเอง

## 4. What failure taught you the most?
การ deploy บน Render ทำให้พบว่าการตั้งค่าและขั้นตอนเริ่มระบบที่ใช้ได้ในเครื่อง อาจไม่เพียงพอสำหรับ production จึงต้องปรับการเริ่ม backend และการตั้งค่าให้เหมาะกับสภาพแวดล้อมจริง

## 5. What would you do differently?
จะทดสอบ deployment และการเชื่อมต่อ frontend-backend ตั้งแต่ช่วงแรก พร้อมทำ integration tests ครอบคลุมเส้นทางใช้งานหลักก่อนใกล้ส่งงาน

## 6. How did you embody Tip 52 (Delight Users)?
ทำให้ผู้ใช้ทำงานต่อเนื่องได้ในแอปเดียว ทั้งจัดการโน้ต ค้นหาเอกสาร อัปโหลดไฟล์ และใช้ AI ช่วยสรุปหรือสร้าง quiz โดยมีการบันทึกข้อมูลและผลลัพธ์ไว้ใช้งานต่อ


หลักฐาน: [ภาพหน้าจอ / commit]

## 7. How did you embody Tip 53 (Sign Your Work)?
จัดโครงสร้าง backend แยกเป็น routers, models, schemas และ services พร้อมเพิ่ม tests, migration และเอกสาร setup/API เพื่อให้ทีมตรวจสอบและพัฒนาต่อได้

## 8. What value did this experience add to your SE journey?
ได้ฝึกพัฒนาระบบที่เชื่อมต่อกันตั้งแต่ frontend, API, ฐานข้อมูล ไปจนถึง deployment และเข้าใจว่าความสำเร็จของฟีเจอร์ไม่ได้จบแค่เขียนโค้ด แต่ต้องปลอดภัย ทดสอบได้ และนำไปใช้งานจริงได้ด้วย
---
**AI usage:** ช่วยสรุปเนื้อหาคาบ Grand Finale (Demo Day, จรรยาบรรณ, Final Reflection) อัปเดต `AI_USAGE.md`