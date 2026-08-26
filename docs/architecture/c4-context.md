# C4 Model - Level 1: System Context Diagram

```mermaid
C4Context
    title System Context Diagram for Lecture Buddy

    Person(student, "นักศึกษา", "จัดการโน้ต ดูสรุปและแบบทดสอบ")
    Person(admin, "Admin", "จัดการผู้ใช้ ตรวจสอบข้อมูล")

    System(lectureBuddy, "Lecture Buddy", "ระบบจัดการโน้ต สรุปเนื้อหา และสร้างแบบทดสอบ")

    System_Ext(aiService, "บริการ AI", "สรุปเนื้อหาและสร้างคำถามทบทวน")

    Rel(student, lectureBuddy, "จัดการโน้ต, ดูสรุปและแบบทดสอบ")
    Rel(admin, lectureBuddy, "จัดการผู้ใช้, ตรวจสอบข้อมูล")
    Rel(lectureBuddy, aiService, "ส่งเนื้อหาโน้ต")
    Rel(aiService, lectureBuddy, "ส่งผลสรุปและคำถาม")