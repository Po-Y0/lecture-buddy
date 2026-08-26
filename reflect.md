# Reflection - Post-quiz 5

## 1. Architectural Decision Reflection
การตัดสินใจเลือก Monolith ด้วย FastAPI ช่วยลดภาระการจัดตั้ง Infrastructure ทำให้ทีมโฟกัสไปที่การเชื่อมต่อ AI API เพื่อให้ฟีเจอร์สรุปเนื้อหาและสร้างแบบทดสอบใช้งานได้จริงเร็วที่สุด

## 2. C4 Diagram Insights
การแปลงภาพไดอะแกรมมาอยู่ในรูปแบบ Mermaid ใน Markdown ช่วยให้ทุกคนในทีมแก้ไขภาพ Architecture ร่วมกันได้ง่ายบน GitHub โดยไม่ต้องส่งไฟล์รูปภาพข้ามไปมา

## 3. Tech Stack Justification
เลือกใช้ FastAPI เนื่องจากความสามารถในการประมวลผลแบบ Asynchronous I/O ซึ่งตอบโจทย์การเรียกใช้บริการ External AI Service ที่อาจต้องรอ Response เวลาประมวลผลสรุปโน้ตยาว ๆ