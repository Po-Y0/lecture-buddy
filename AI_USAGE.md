
# AI Usage Disclosure

### Tool Used

**เครื่องมือที่ใช้:** Generative AI / ChatGPT 

### How AI Was Used

ทีมได้ใช้ Generative AI หรือ ChatGPT เป็นเครื่องมือช่วยในการวางแผนและพัฒนาเอกสารของโครงงาน **Lecture Buddy** โดยนำมาใช้ในด้านต่าง ๆ ดังนี้

* ช่วยระดมความคิดเกี่ยวกับฟังก์ชันและความสามารถที่เหมาะสมกับโครงงาน Lecture Buddy
* ช่วยร่าง **User Stories** และ **Acceptance Criteria** ในเบื้องต้น
* ช่วยเสนอรายการ **Product Backlog** และประเมินขนาดงานเบื้องต้นในระดับ S/M/L
* ช่วยจัดโครงสร้างเอกสาร **Project Proposal** และ **Definition of Done**
* ช่วยตรวจสอบและปรับปรุงการเรียบเรียงเนื้อหาให้มีความชัดเจนและเป็นระบบมากขึ้น

### Team Verification

เนื้อหาหรือแนวคิดที่ได้จาก AI ไม่ได้นำมาใช้โดยตรงทั้งหมด สมาชิกในทีมได้ร่วมกันตรวจสอบ พูดคุย และพิจารณาความเหมาะสมก่อนนำไปใช้ในโครงงาน

ทีมเป็นผู้ตัดสินใจขั้นสุดท้ายเกี่ยวกับ **แนวคิดของโครงงาน กลุ่มผู้ใช้งานเป้าหมาย ลำดับความสำคัญของฟังก์ชัน ขอบเขตของโครงงาน ความเสี่ยง และ Acceptance Criteria**

นอกจากนี้ ทีมได้ปรับแก้เนื้อหาที่ AI สร้างขึ้นเมื่อจำเป็น เพื่อให้สอดคล้องกับแนวคิดของโครงงาน ความต้องการของผู้ใช้งาน และข้อจำกัดด้านการพัฒนาของทีม

> **หมายเหตุ:** AI ทำหน้าที่เป็นเครื่องมือช่วยในการคิดและจัดทำเอกสาร โดยการตัดสินใจและความรับผิดชอบต่อเนื้อหาของโครงงานเป็นของสมาชิกในทีม
=======
feature/lab5-architecture
# Generative AI Usage Report

## Tools Used
- ChatGPT / Claude / GitHub Copilot

## Prompts Used
1. *"แปลงแผนผัง C4 Diagram จากรูปภาพให้อยู่ในรูปแบบโค้ด Mermaid Syntax สำหรับ Level 1 และ Level 2"*
2. *"ช่วยร่าง ADR เรื่องการเลือกใช้ FastAPI ร่วมกับ PostgreSQL และ OpenAI API สำหรับแอปพลิเคชันสรุปโน้ตการเรียน"*

## AI-Generated Content & Adaptations
- **Mermaid Diagrams**: ใช้ AI ช่วยแปลงคำอธิบายองค์ประกอบระบบในภาพให้อยู่ในโครงสร้าง C4Context และ C4Container Mermaid โดยปรับแต่งเส้นเชื่อมต่อ (Rel) ให้ตรงโปรโตคอล
- **ADR & Rationale**: ใช้ AI ช่วยวิเคราะห์ข้อดีข้อเสียของการใช้ FastAPI ร่วมกับระบบ AI และสรุปลงในสเปกของทีม
=======
# AI Usage Disclosure

## Tool Used

Generative AI / ChatGPT

## How AI Was Used

The team used Generative AI to:

* Brainstorm potential features for the Lecture Buddy project.
* Draft initial User Stories and Acceptance Criteria.
* Suggest Product Backlog items and estimate their relative size (S/M/L).
* Help structure the Project Proposal and Definition of Done.

## Team Verification

All AI-generated suggestions were reviewed and discussed by team members. The team made the final decisions regarding the project theme, target persona, feature priorities, project scope, risks, and acceptance criteria.

AI-generated content was modified when necessary to ensure that it accurately reflected the team's project concept and development constraints.
 main

 # AI Usage

## Tools

- ChatGPT

## Prompts Used

### Prompt 1
สร้างโครงสร้าง HTML สำหรับ Interactive Prototype ของเว็บแอปชื่อ "Lecture Buddy" สำหรับนักศึกษา โดยอ้างอิง User Story:

"As a student, I want to create and manage my courses so that I can organize my learning materials by subject."

ต้องมี:

1. Header ที่มีชื่อ Lecture Buddy
2. Section แสดงรายการ My Courses
3. ปุ่ม "+ Add Course"
4. Course card ที่แสดง Course Name และ Course Code
5. ปุ่ม Edit และ Delete ในแต่ละ course card
6. Modal form สำหรับเพิ่ม/แก้ไขรายวิชา โดยมี Course Name และ Course Code
7. ปุ่ม Cancel และ Save
8. ใช้ semantic HTML เช่น header, main, section, article
9. ใช้ HTML, CSS และ JavaScript แบบ plain เท่านั้น
10. ห้ามใช้ React, Vue, Bootstrap หรือ external framework

ให้โค้ดอ่านง่ายและเหมาะสำหรับนักศึกษาที่กำลังสร้าง prototype ใน Lab 4


### Prompt 2
ช่วยเพิ่ม JavaScript interaction ให้กับ Course Management Prototype ของ Lecture Buddy โดยไม่ใช้ framework

ต้องรองรับ:

1. เปิดและปิด Add Course modal
2. เพิ่ม course ใหม่จากข้อมูล Course Name และ Course Code
3. แสดง course ใหม่ใน course list โดยไม่ต้อง reload หน้า
4. กด Edit เพื่อเปิดข้อมูล course เดิมใน form
5. แก้ไข Course Name และ Course Code แล้วบันทึกการเปลี่ยนแปลง
6. กด Delete แล้วแสดง confirmation ก่อนลบ
7. หลังลบ course ให้ course card หายจากหน้าเว็บทันที
8. ตรวจสอบว่า Course Name และ Course Code ไม่เป็นค่าว่าง
9. ใช้ plain JavaScript เท่านั้น
10. อธิบายส่วนสำคัญของ JavaScript ที่เพิ่มเข้ามาแบบสั้น ๆ


## AI-Generated Parts

AI was used to generate an initial HTML structure
and suggest JavaScript event-handling logic.

## Parts Written or Modified by the Team

- Course card layout
- Course form structure
- CSS styling
- CRUD interaction logic
- Validation
- Confirmation dialog
- UI text and labels

## Review

The team reviewed and modified AI-generated code
before using it in the prototype.


## Lab 12B - Safety Net Sprint 

เครื่องมือ: - ChatGPT 

Prompt ที่ใช้: 
1. ช่วยเสนอ test cases ของ validate_course แบ่งเป็น happy, edge, error 
2. ช่วยอธิบายวิธีเขียน GitHub Actions CI 

ส่วนที่นำมาใช้: - ไอเดีย test cases ที

ทีมได้ตรวจสอบและทำความเข้าใจโค้ดทั้งหมดก่อนส่ง 

## Sprint พัฒนา Frontend (React + Vite)

เครื่องมือ: Claude

Prompt ที่ใช้:
1. ช่วยอธิบายและแนะนำการเขียนโค้ด React + Vite
2. ช่วยเสนอแนวทางและตัวอย่างฟีเจอร์ เช่น หน้า My Courses, Notes panel (สร้าง/แก้ไข/ปักหมุด/แท็ก), Pinned Notes แยกตามรายวิชา, Review Center (คิวทบทวน + Practice), ค้นหาข้ามรายวิชา (⌘K), export โน้ตเป็น .md, ปุ่ม AI Summarize / Make quiz (ใช้ mock data) และการเลือกจำนวนข้อ quiz
3. ช่วยเสนอแนวทางปรับ UI/UX ให้เหมาะกับนิสิตและวัยทำงาน

ส่วนที่นำมาใช้:
1. ลบหน้า Dashboard ออกจากแอป
2. เลือก Quick add สำหรับปุ่ม New Study Session
3. กำหนดให้ Add Course form มีเฉพาะชื่อวิชา สี และไอคอน และให้มีการอัปโหลดไฟล์ต่อรายวิชา
4. เลือกฟีเจอร์ถัดไป (Review Center, ⌘K, export .md, quiz เลือกความยาวได้), ให้ Login ต้องสมัครสมาชิกก่อน, และปรับข้อความ UI บางส่วนเป็นภาษาไทย
5. วางแผนให้ frontend เสร็จก่อนแล้วส่งต่อให้เพื่อนทำ backend
6. การตรวจสอบ: ทดสอบการทำงานบน Safari และ Chrome และแก้ไขโค้ดจาก AI ให้ตรงกับความต้องการของระบบก่อนนำไปใช้

## Final Reflection (Lab 15)

เครื่องมือ: Claude

Prompt ที่ใช้: - ช่วยสรุปเนื้อหาคาบ Grand Finale (Demo Day, จรรยาบรรณ, Final Reflection)

ส่วนที่นำมาใช้: - ตอบคำถามจากประสบการณ์จริง รวมถึงเลือกหลักฐานลิงก์ commit เอง