const KEY = "quizResults";

export function getQuizResults() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}

export function addQuizResult({ courseId, score, total }) {
  const next = [
    ...getQuizResults(),
    { id: crypto.randomUUID(), courseId, score, total, takenAt: Date.now() },
  ];
  localStorage.setItem(KEY, JSON.stringify(next));
}

// ผลล่าสุดของวิชาหนึ่ง (ไม่มีให้ null)
export function latestResultFor(results, courseId) {
  return (
    results
      .filter((r) => r.courseId === courseId)
      .sort((a, b) => b.takenAt - a.takenAt)[0] ?? null
  );
}