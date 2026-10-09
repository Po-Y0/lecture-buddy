# Final Reflection — [นางสาวปาริชาต จันจม] ([67021095])

## 1. What did you build?
สร้าง Lecture Buddy เว็บแอปจัดการโน้ตการเรียนด้วย AI สำหรับ mini project โดยเริ่มจาก prototype ใน `prototypes/sprint1` (ฟีเจอร์ Edit/Delete Subject) แล้วพัฒนาเป็นโปรเจกต์ React + Vite ดังนี้

- หน้า **My Courses** แสดงรายวิชาเป็นการ์ด (`CourseCard.jsx`), `Sidebar.jsx`, `UploadModal.jsx` สำหรับอัปโหลดไฟล์ต่อรายวิชา และ Add Course ที่มีชื่อวิชา สี และไอคอนให้เลือก
- Notes panel ในหน้ารายวิชา: สร้าง แก้ไข ปักหมุด และติดแท็ก
- Pinned Notes ที่แยกเป็นบล็อกตามรายวิชา
- Review Center: คิวทบทวนโน้ตที่ไม่ได้เปิดนาน (มีปุ่ม Mark as reviewed) และส่วน Practice สำหรับทำ quiz ต่อวิชา
- ปุ่ม AI Summarize / Make quiz (ตอนนี้ใช้ mock data) ให้เลือกจำนวนข้อ quiz ได้ (10-100 ข้อ)
- ค้นหาข้ามรายวิชา (⌘K) และ export โน้ตเป็น .md

หลักฐาน: [https://github.com/Software-Engineering-Concepts-2026/se-sec1-team-03/tree/feature/parichat_j]

## 2. What problem did you solve?
นิสิตมีเอกสารและโน้ตกระจายหลายรายวิชา ทำให้ค้นหาและกลับมาทบทวนได้ยาก Lecture Buddy จึงรวมโน้ตและไฟล์ไว้แยกตามรายวิชาในที่เดียว ให้ค้นหาข้ามวิชาได้ ปักหมุดโน้ตสำคัญ มีคิวเตือนทบทวนโน้ตที่ไม่ได้เปิดนาน และมี AI ช่วยสรุปเนื้อหาและสร้าง quiz

## 3. What technical decision are you proudest of?
สร้าง frontend ให้เสร็จก่อนด้วย mock data แล้วค่อยส่งต่อให้เพื่อนทำ backend
หลักฐาน: [https://github.com/Software-Engineering-Concepts-2026/se-sec1-team-03/tree/feature/parichat_j]

## 4. What failure taught you the most?
บทเรียนที่ได้มากที่สุดคือ หน้า Review Center ตอนแรกไม่ทำงาน เพราะคิวทบทวนว่างเปล่า สิ่งที่ได้เรียนรู้คือ
- หน้าที่ฟังก์ชันถูกต้องแต่ไม่มี demo data จริง
- ต้องออกแบบ empty state และข้อมูลตัวอย่างตั้งแต่แรก
และการย้ายไปสร้าง Vite project ใหม่ ืทำให้เสียเวลาย้ายโค้ดและทำให้เห็นว่าควรวางโครงสร้างโปรเจกต์ให้ชัดตั้งแต่ต้น 

## 5. What would you do differently?
- เตรียม seed/demo data ตั้งแต่เริ่มทำแต่ละหน้า ไม่รอจนท้าย sprint
- ตั้งโครงสร้างโปรเจกต์และตัดสินใจ scope ให้เสร็จก่อนเริ่มเขียน (รวมถึงจัด MoSCoW ล่วงหน้า)
- เขียน test สำหรับ logic หลัก ก่อนต่อกับ backend
- ตั้งเป้าต่อไป: ต่อ AI จริงแทน mock data และทำ Login แบบต้องสมัครสมาชิกก่อน

## 6. How did you embody Tip 52 (Delight Users)?
- Quick add: ปุ่ม New Study Session เลือกวิชาแล้วเพิ่มโน้ตหรืออัปโหลดไฟล์ได้จากทุกหน้า
- ⌘K ค้นหาข้ามรายวิชาแบบเร็ว
- ปักหมุดโน้ตและแยก Pinned Notes ตามรายวิชา
- ออกแบบ UI ใหม่ให้น่าใช้ เลือกไอคอน formal ใน sidebar และเริ่มปรับข้อความบางส่วนเป็นภาษาไทย
- ให้ผู้ใช้เลือกจำนวนข้อ quiz เองได้

หลักฐาน: [ภาพหน้าจอ / commit]

## 7. How did you embody Tip 53 (Sign Your Work)?
- ตั้งชื่อและจัดโครงสร้างโค้ดเป็นคอมโพเนนต์ชัดเจน (`CourseCard`, `Sidebar`, `UploadModal`)
- เอกสารโครงสร้างฐานข้อมูล Users → Courses → Notes → Tags → AI_Summaries → Quizzes เพื่อให้เพื่อนที่ทำ backend อ่านต่อได้
- README และ commit message

## 8. What value did this experience add to your SE journey?
ทำให้ได้ทำงานตั้งแต่ออกแบบข้อมูล ทำ UI ส่งต่อให้ทีม ได้ฝึกวางแผนด้วย MoSCoW การตัดสินใจตัด scope และการทำงานแบบแบ่งหน้าที่ frontend/backend
---
**AI usage:** ช่วยสรุปเนื้อหาคาบ Grand Finale (Demo Day, จรรยาบรรณ, Final Reflection) อัปเดต `AI_USAGE.md`