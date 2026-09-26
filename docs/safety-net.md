# Safety Net ของทีม Lecture Buddy

## 1. ฟังก์ชันที่เลือกทดสอบ

- ฟังก์ชัน: validate_course
- ไฟล์: src/course.py

เหตุผล:
เป็น business logic สำหรับตรวจสอบข้อมูลก่อนสร้างรายวิชา
และไม่พึ่งฐานข้อมูลหรือ API ภายนอก

---

## 2. เทสต์ที่เขียน

1. test_valid_course (happy)
2. test_valid_course_max_credit (happy)
3. test_minimum_credit_boundary (edge)
4. test_maximum_credit_boundary (edge)
5. test_empty_course_code_raises (error)
6. test_short_course_code_raises (error)
7. test_invalid_credit_raises (error)

---

## 3. Coverage

100%

```text
Name            Stmts   Miss Cover
----------------------------------
src/course.py      10      0 100%