# C4 Model - Level 2: Container Diagram

```mermaid
C4Container
    title Container Diagram for Lecture Buddy

    Person(student, "นักศึกษา", "ผู้ใช้งานทั่วไป")
    Person(admin, "Admin", "ผู้ดูแลระบบ")

    System_Boundary(c1, "Lecture Buddy") {
        Container(webApp, "Frontend Web App", "React + Vite", "แสดงหน้าจอและรับคำสั่งผู้ใช้")
        Container(apiServer, "Backend API", "FastAPI", "จัดการตรรกะและเชื่อมต่อบริการต่าง ๆ")
        ContainerDb(database, "Database", "PostgreSQL", "เก็บผู้ใช้ รายวิชา โน้ต สรุป และแบบทดสอบ")
    }

    System_Ext(aiService, "บริการ AI", "สรุปเนื้อหา สรุปคำถามทบทวน")

    Rel(student, webApp, "ใช้งานเว็บไซต์")
    Rel(admin, webApp, "จัดการระบบ")
    Rel(webApp, apiServer, "REST API / JSON / HTTPS")
    Rel(apiServer, database, "อ่านและบันทึกข้อมูล")
    Rel(apiServer, aiService, "ส่งเนื้อหาโน้ต")
    Rel(aiService, apiServer, "ส่งผลลัพธ์กลับ")