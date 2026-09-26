# src/course.py

def validate_course(course_code, course_name, credits):
    """
    ตรวจสอบข้อมูลรายวิชาก่อนสร้าง
    """

    if not course_code:
        raise ValueError("course code required")

    if len(course_code) < 6:
        raise ValueError("course code must be at least 6 digits")

    if not course_name:
        raise ValueError("course name required")

    if credits < 1 or credits > 6:
        raise ValueError("credits must be between 1 and 6")

    return True