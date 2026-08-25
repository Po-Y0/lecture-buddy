export class CourseManager {
  constructor(initialCourses = []) {
    this.courses = [...initialCourses];
  }

  addCourse(course) {
    if (!course.name || !course.code) {
      throw new Error("Course name and code are required");
    }

    const exists = this.courses.some(
      (item) => item.code.toLowerCase() === course.code.toLowerCase()
    );

    if (exists) {
      throw new Error("Course already exists");
    }

    const newCourse = {
      id: crypto.randomUUID(),
      name: course.name,
      code: course.code,
      documents: course.documents ?? 0,
      notes: course.notes ?? 0,
      progress: course.progress ?? 0,
      color: course.color ?? "#4d0b83",
      lightColor: course.lightColor ?? "#ead8ff",
    };

    this.courses.push(newCourse);

    return newCourse;
  }

  addDocument(courseCode) {
    const course = this.courses.find(
      (item) => item.code === courseCode
    );

    if (!course) {
      throw new Error("Course not found");
    }

    course.documents += 1;

    return course;
  }

  getCourses() {
    return [...this.courses];
  }
}