import test from "node:test";
import assert from "node:assert/strict";

import { CourseManager } from "../courseManager.js";

test("Unit Test - should create a course", () => {
  const manager = new CourseManager();

  const course = manager.addCourse({
    name: "Software Engineering",
    code: "CS 401",
  });

  assert.equal(course.name, "Software Engineering");
  assert.equal(course.code, "CS 401");
  assert.equal(course.documents, 0);
  assert.equal(course.notes, 0);
  assert.equal(course.progress, 0);
});

test("Unit Test - should reject a course without name", () => {
  const manager = new CourseManager();

  assert.throws(
    () =>
      manager.addCourse({
        name: "",
        code: "CS 401",
      }),
    /Course name and code are required/
  );
});

test("Unit Test - should reject duplicate course", () => {
  const manager = new CourseManager();

  manager.addCourse({
    name: "Software Engineering",
    code: "CS 401",
  });

  assert.throws(
    () =>
      manager.addCourse({
        name: "Software Engineering 2",
        code: "CS 401",
      }),
    /Course already exists/
  );
});

test("Integration Test - should add a course and retrieve it in My Courses", () => {
  const manager = new CourseManager();

  manager.addCourse({
    name: "Web Programming",
    code: "CS 250",
  });

  const courses = manager.getCourses();

  assert.equal(courses.length, 1);
  assert.equal(courses[0].name, "Web Programming");
  assert.equal(courses[0].code, "CS 250");
});

test("Integration Test - should upload a document to a course", () => {
  const manager = new CourseManager();

  manager.addCourse({
    name: "Database Systems",
    code: "CS 320",
    documents: 15,
  });

  const updatedCourse = manager.addDocument("CS 320");

  assert.equal(updatedCourse.documents, 16);
});

test("Integration Test - should preserve multiple courses", () => {
  const manager = new CourseManager();

  manager.addCourse({
    name: "Software Engineering",
    code: "CS 401",
  });

  manager.addCourse({
    name: "Database Systems",
    code: "CS 320",
  });

  manager.addCourse({
    name: "Web Programming",
    code: "CS 250",
  });

  const courses = manager.getCourses();

  assert.equal(courses.length, 3);
  assert.deepEqual(
    courses.map((course) => course.code),
    ["CS 401", "CS 320", "CS 250"]
  );
});

test("Unit Test - should reject a course without code", () => {
  const manager = new CourseManager();

  assert.throws(
    () =>
      manager.addCourse({
        name: "Software Engineering",
        code: "",
      }),
    /Course name and code are required/
  );
});

test("Unit Test - should treat course codes as case-insensitive", () => {
  const manager = new CourseManager();

  manager.addCourse({
    name: "Software Engineering",
    code: "CS 401",
  });

  assert.throws(
    () =>
      manager.addCourse({
        name: "Software Engineering 2",
        code: "cs 401",
      }),
    /Course already exists/
  );
});

test("Unit Test - should use zero as default document count", () => {
  const manager = new CourseManager();

  const course = manager.addCourse({
    name: "Database Systems",
    code: "CS 320",
  });

  assert.equal(course.documents, 0);
});