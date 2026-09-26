# tests/test_course.py

import pytest

from src.course import validate_course


# --------------------
# Happy Path
# --------------------

def test_valid_course():
    """
    รายวิชาปกติควรผ่าน
    """

    assert validate_course(
        "225311",
        "Software Engineering",
        3
    ) is True


def test_valid_course_max_credit():
    """
    หน่วยกิตสูงสุดที่อนุญาต
    """

    assert validate_course(
        "225399",
        "Senior Project",
        6
    ) is True


# --------------------
# Edge Cases
# --------------------

def test_minimum_credit_boundary():
    """
    หน่วยกิตต่ำสุด = 1
    """

    assert validate_course(
        "225311",
        "Software Engineering",
        1
    ) is True


def test_maximum_credit_boundary():
    """
    หน่วยกิตสูงสุด = 6
    """

    assert validate_course(
        "225311",
        "Software Engineering",
        6
    ) is True


# --------------------
# Error Cases
# --------------------

def test_empty_course_code_raises():
    """
    ไม่มีรหัสวิชา
    """

    with pytest.raises(ValueError):
        validate_course(
            "",
            "Software Engineering",
            3
        )


def test_short_course_code_raises():
    """
    รหัสวิชาสั้นเกิน
    """

    with pytest.raises(ValueError):
        validate_course(
            "123",
            "Software Engineering",
            3
        )


def test_invalid_credit_raises():
    """
    หน่วยกิตเกินช่วง
    """

    with pytest.raises(ValueError):
        validate_course(
            "225311",
            "Software Engineering",
            10
        )
def test_empty_course_name_raises():
    with pytest.raises(ValueError):
        validate_course(
            "225311",
            "",
            3
        )