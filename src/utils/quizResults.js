import { apiGet, apiPost } from "../api/client";

export function getQuizResults() {
  return apiGet("/quiz-attempts");
}

export function addQuizResult({ quizId, answers }) {
  return apiPost(`/quizzes/${encodeURIComponent(quizId)}/attempts`, { answers });
}

export function latestResultFor(results, courseId) {
  return (
    results
      .filter((result) => result.courseId === courseId)
      .sort((a, b) => b.takenAt - a.takenAt)[0] ?? null
  );
}
