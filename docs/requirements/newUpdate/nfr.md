# Lecture Buddy — Functional & Non-Functional Requirements

## Functional Requirements (FR)

Functional Requirements กำหนดความสามารถและพฤติกรรมที่ระบบ Lecture Buddy ต้องสามารถทำได้ เพื่อรองรับ User Stories และ User Scenarios ของผู้ใช้งาน

---

### FR-01 — จัดการรายวิชา

ระบบต้องสามารถให้ผู้ใช้สร้าง แก้ไข และลบรายวิชาได้ โดยแต่ละรายวิชาต้องมีข้อมูลอย่างน้อย ได้แก่ ชื่อรายวิชา และรายละเอียดของรายวิชา

**Related User Story:** US-01

---

### FR-02 — จัดการบทเรียน

ระบบต้องสามารถให้ผู้ใช้สร้าง แก้ไข และลบบทเรียนภายใต้รายวิชาที่กำหนดได้ เพื่อจัดหมวดหมู่เนื้อหาตามบทเรียน

**Related User Story:** US-01, US-02

---

### FR-03 — สร้างและจัดการโน้ต

ระบบต้องสามารถให้ผู้ใช้สร้าง แก้ไข และลบโน้ตภายใต้รายวิชาและบทเรียนที่เลือกได้

**Related User Story:** US-02

---

### FR-04 — Upload เอกสาร

ระบบต้องสามารถให้ผู้ใช้อัปโหลดเอกสารการเรียนเข้าสู่รายวิชาและบทเรียนที่กำหนดได้

ระบบต้องบันทึกข้อมูลของเอกสาร เช่น ชื่อไฟล์ ประเภทไฟล์ ขนาดไฟล์ และวันที่อัปโหลด

**Related User Story:** US-03

---

### FR-05 — แสดงและจัดการเอกสาร

ระบบต้องสามารถแสดงรายการเอกสารที่อยู่ภายในรายวิชาและบทเรียน และให้ผู้ใช้สามารถเปิดดู ดาวน์โหลด หรือลบเอกสารของตนเองได้

**Related User Story:** US-03

---

### FR-06 — ค้นหาโน้ตและเอกสาร

ระบบต้องสามารถค้นหาโน้ตและเอกสารจาก Keyword ที่ผู้ใช้ป้อน และแสดงรายการผลลัพธ์ที่เกี่ยวข้อง

**Related User Story:** US-04

---

### FR-07 — ปักหมุดเนื้อหาสำคัญ

ระบบต้องสามารถให้ผู้ใช้ปักหมุดและยกเลิกการปักหมุดโน้ตหรือเนื้อหาที่สำคัญได้ และต้องสามารถแสดงรายการเนื้อหาที่ถูกปักหมุดเพื่อให้เข้าถึงได้อย่างรวดเร็ว

**Related User Story:** US-05

---

## AI Learning

### FR-08 — สร้าง Summary ด้วย AI

ระบบต้องสามารถประมวลผลโน้ตหรือเอกสารที่ผู้ใช้เลือก และสร้างสรุปเนื้อหาด้วย AI โดยแสดงผลเป็นข้อความที่อ่านและเข้าใจได้ง่าย

**Related User Story:** US-06

---

### FR-09 — แสดง Key Points

ระบบต้องสามารถแสดงประเด็นสำคัญ (Key Points) จากเนื้อหาที่ AI วิเคราะห์ เพื่อช่วยให้ผู้ใช้สามารถทบทวนเนื้อหาได้อย่างรวดเร็ว

**Related User Story:** US-06

---

### FR-10 — อธิบายเนื้อหาแบบเข้าใจง่าย

ระบบต้องสามารถให้ผู้ใช้เลือกหัวข้อหรือเนื้อหาที่ต้องการ และส่งข้อมูลดังกล่าวให้ AI อธิบายด้วยภาษาที่เข้าใจง่าย

**Related User Story:** US-07

---

### FR-11 — สร้างคำถามทบทวนด้วย AI

ระบบต้องสามารถสร้างคำถามทบทวนจากโน้ตหรือเอกสารที่ผู้ใช้เลือกได้ โดยผู้ใช้สามารถกำหนดจำนวนคำถามและระดับความยากได้

**Related User Story:** US-08

---

### FR-12 — ทำ Quiz

ระบบต้องสามารถแสดงคำถามที่สร้างขึ้นและให้ผู้ใช้ตอบคำถามทีละข้อหรือเป็นชุดได้

เมื่อผู้ใช้ส่งคำตอบ ระบบต้องตรวจสอบคำตอบและแสดงผลว่าถูกหรือผิด

**Related User Story:** US-09

---

### FR-13 — แสดงเฉลยและคำอธิบาย

ระบบต้องสามารถแสดงเฉลยพร้อมคำอธิบายสำหรับคำตอบที่ผู้ใช้ตอบผิด เพื่อช่วยให้ผู้ใช้เรียนรู้จากข้อผิดพลาด

**Related User Story:** US-09

---

### FR-14 — แนะนำหัวข้อที่เกี่ยวข้อง

ระบบต้องสามารถวิเคราะห์เนื้อหาที่ผู้ใช้กำลังเรียนและแนะนำหัวข้อที่เกี่ยวข้องหรือหัวข้อที่ควรศึกษาเพิ่มเติม

**Related User Story:** US-10

---

## Review & Progress

### FR-15 — สร้าง Review Checklist

ระบบต้องสามารถสร้างหรือแสดง Checklist สำหรับแต่ละบทเรียน โดยประกอบด้วยรายการเนื้อหาหรือกิจกรรมที่ผู้ใช้ต้องทบทวน

**Related User Story:** US-11

---

### FR-16 — บันทึกสถานะการทบทวน

ระบบต้องสามารถให้ผู้ใช้ทำเครื่องหมายรายการใน Review Checklist ว่า “ทบทวนแล้ว” หรือ “ยังไม่ได้ทบทวน” และบันทึกสถานะดังกล่าว

**Related User Story:** US-11

---

### FR-17 — แสดง Progress

ระบบต้องสามารถคำนวณและแสดงความคืบหน้าของการทบทวน เช่น จำนวนบทเรียนที่ทบทวนแล้ว จำนวนที่เหลือ และเปอร์เซ็นต์ความคืบหน้า

**Related User Story:** US-12

---

### FR-18 — วิเคราะห์หัวข้อที่ควรทบทวน

ระบบต้องสามารถวิเคราะห์ข้อมูลจาก Progress, ผลการทำ Quiz และสถานะการทบทวน เพื่อระบุหัวข้อที่ผู้ใช้ควรกลับไปทบทวน

**Related User Story:** US-13

---

### FR-19 — AI Study Recommendation

ระบบต้องสามารถแนะนำลำดับหรือหัวข้อที่ผู้ใช้ควรทบทวนต่อไป โดยพิจารณาจากข้อมูลการเรียนและเวลาที่ผู้ใช้มี

**Related User Story:** US-13

---

## Functional Requirements Summary

| ID    | Functional Requirement     | Related User Story |
| ----- | -------------------------- | ------------------ |
| FR-01 | จัดการรายวิชา              | US-01              |
| FR-02 | จัดการบทเรียน              | US-01, US-02       |
| FR-03 | สร้างและจัดการโน้ต         | US-02              |
| FR-04 | Upload เอกสาร              | US-03              |
| FR-05 | แสดงและจัดการเอกสาร        | US-03              |
| FR-06 | ค้นหาโน้ตและเอกสาร         | US-04              |
| FR-07 | ปักหมุดเนื้อหาสำคัญ        | US-05              |
| FR-08 | สร้าง Summary ด้วย AI      | US-06              |
| FR-09 | แสดง Key Points            | US-06              |
| FR-10 | อธิบายเนื้อหาแบบเข้าใจง่าย | US-07              |
| FR-11 | สร้างคำถามทบทวนด้วย AI     | US-08              |
| FR-12 | ทำ Quiz                    | US-09              |
| FR-13 | แสดงเฉลยและคำอธิบาย        | US-09              |
| FR-14 | แนะนำหัวข้อที่เกี่ยวข้อง   | US-10              |
| FR-15 | สร้าง Review Checklist     | US-11              |
| FR-16 | บันทึกสถานะการทบทวน        | US-11              |
| FR-17 | แสดง Progress              | US-12              |
| FR-18 | วิเคราะห์หัวข้อที่ควรทบทวน | US-13              |
| FR-19 | AI Study Recommendation    | US-13              |

---

# Non-Functional Requirements (NFR)

Non-Functional Requirements กำหนดคุณภาพ ประสิทธิภาพ ความปลอดภัย และข้อจำกัดในการทำงานของระบบ โดยกำหนด Metric ที่สามารถวัดผลได้

| Category            | Non-Functional Requirement                                      | Metric                                                                                          |
| ------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Performance**     | หน้า Dashboard, Course และ Note ต้องตอบสนองต่อการกด/ค้นหาข้อมูล | **Response time < 2 seconds ที่ p95 เมื่อ dataset ≤ 100 records**                               |
| **Performance**     | ระบบต้องแสดงสถานะระหว่าง AI ประมวลผล                            | **แสดง loading/progress indicator ภายใน ≤ 1 second หลังผู้ใช้ส่งคำขอ**                          |
| **Performance**     | การ Upload เอกสารต้องเริ่มประมวลผลหลัง Upload สำเร็จ            | **ระบบเริ่ม Processing ภายใน ≤ 3 seconds หลัง Upload สำเร็จ สำหรับไฟล์ ≤ 20 MB**                |
| **Security**        | ผู้ใช้ต้องตั้งรหัสผ่านที่มีความปลอดภัยขั้นต่ำ                   | **Password ≥ 8 characters และต้องประกอบด้วยตัวอักษรและตัวเลขอย่างน้อย 1 ตัว**                   |
| **Security**        | ระบบต้องหมดอายุ Session เมื่อไม่มีการใช้งาน                     | **Session timeout หลังไม่มี Activity 30 นาที**                                                  |
| **Security**        | ผู้ใช้ต้องไม่สามารถเข้าถึงข้อมูลของผู้ใช้อื่น                   | **100% ของ API ที่เข้าถึง Note/Document ต้องตรวจสอบ ownership ก่อนคืนข้อมูล**                   |
| **Security**        | ข้อมูลระหว่าง Browser และ Server ต้องได้รับการเข้ารหัส          | **ใช้ HTTPS/TLS 1.2 หรือสูงกว่าใน 100% ของ Production traffic**                                 |
| **Availability**    | ระบบต้องพร้อมใช้งานในช่วงเวลาที่นักศึกษาใช้งานหลัก              | **Uptime ≥ 99% ระหว่าง 08:00–22:00 น.**                                                         |
| **Availability**    | ระบบต้องมีการสำรองข้อมูล                                        | **Backup ข้อมูลผู้ใช้อย่างน้อย 1 ครั้งต่อวัน และสามารถกู้คืนข้อมูลล่าสุดได้ภายใน ≤ 24 ชั่วโมง** |
| **Scalability**     | ระบบต้องรองรับผู้ใช้งานพร้อมกัน                                 | **รองรับ Concurrent Users ≥ 100 คน โดย Performance Requirement ยังต้องผ่าน**                    |
| **Scalability**     | ระบบต้องรองรับข้อมูลของนักศึกษา                                 | **รองรับ ≥ 100 courses/user และ ≥ 1,000 notes/user โดยการค้นหาต้องไม่เกิน 2 seconds ที่ p95**   |
| **Usability**       | นักศึกษาใหม่ต้องสามารถเริ่มใช้งานได้โดยไม่ต้องอ่านคู่มือ        | **ผู้ใช้ใหม่ ≥ 80% สามารถสร้าง Course + Note/Upload File + สร้าง Summary สำเร็จภายใน ≤ 3 นาที** |
| **Usability**       | การเข้าถึงฟังก์ชัน AI หลักต้องง่าย                              | **ผู้ใช้สามารถเริ่ม AI Summary ได้ภายใน ≤ 3 clicks จากหน้า Note/Document**                      |
| **Usability**       | Interface ต้องรองรับการใช้งานบนอุปกรณ์ทั่วไป                    | **ฟังก์ชันหลัก 100% ต้องใช้งานได้บนหน้าจอ 360px–1920px โดยไม่เกิด horizontal scrolling**        |
| **Usability**       | การทำ Quiz ต้องไม่ซับซ้อน                                       | **ผู้ใช้ใหม่ ≥ 80% สามารถเริ่ม Quiz จากบทเรียนที่เลือกได้ภายใน ≤ 30 seconds**                   |
| **Accessibility**   | ข้อความและองค์ประกอบ UI ต้องอ่านได้ง่าย                         | **ข้อความเนื้อหาหลักต้องมีขนาด ≥ 16px และ contrast ratio ≥ 4.5:1 สำหรับข้อความปกติ**            |
| **Maintainability** | ระบบต้องสามารถแก้ไข Module ได้โดยไม่กระทบส่วนอื่น               | **Automated test coverage ของ Business Logic ≥ 70%**                                            |
| **Compatibility**   | เว็บต้องรองรับ Browser หลัก                                     | **ฟังก์ชันหลัก 100% ต้องทำงานบน Chrome, Safari และ Edge เวอร์ชันล่าสุด ณ วันที่ Release**       |

---

## Implementation Notes

- The API enforces passwords of at least 8 characters with at least one letter and one digit, and expires the server-side cookie session after 30 minutes of inactivity.
- Uploads are limited to 20 MiB per file and extract text from PDF, DOCX, PPTX, TXT, and MD. OCR is not part of the current MVP; scanned/image-only PDFs return an explicit extraction error.
- Local filesystem upload storage is for development and single-instance persistent-volume deployments. Production must configure durable storage, backups, HTTPS, and `SESSION_COOKIE_SECURE=true`.

## Requirements Traceability

Requirements ของ Lecture Buddy เชื่อมโยงกันตั้งแต่ **Persona → Scenario → User Story → Functional Requirement → Non-Functional Requirement**

| User Need                  | Scenario   | User Story  | Functional Requirement |
| -------------------------- | ---------- | ----------- | ---------------------- |
| จัดระเบียบ Lecture         | Scenario 1 | US-01–US-05 | FR-01–FR-07            |
| เข้าใจ Lecture ได้เร็วขึ้น | Scenario 2 | US-06–US-07 | FR-08–FR-10            |
| ทดสอบความเข้าใจ            | Scenario 3 | US-08–US-10 | FR-11–FR-14            |
| วางแผนก่อนสอบ              | Scenario 4 | US-11–US-13 | FR-15–FR-19            |
