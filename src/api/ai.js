import { apiPost } from "./client";

export function summarizeCourse({ course }) {
  return apiPost(`/courses/${encodeURIComponent(course.id)}/summarize`);
}

export function generateQuiz({ course, count = 10 }) {
  return apiPost(`/courses/${encodeURIComponent(course.id)}/quiz`, { count });
}
