// โหมดจำลอง: ตอนต่อ backend จริง ให้เปลี่ยนเนื้อในสองฟังก์ชันนี้เป็น fetch
//   POST /api/courses/:id/summarize  ->  { summary: string }
//   POST /api/courses/:id/quiz       ->  { questions: [{ id, question, choices[], answerIndex, explanation }] }

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const materials = ({ sources, notes }) => [
  ...notes.map((n) => n.title),
  ...sources.map((s) => s.name),
];

export async function summarizeCourse({ course, sources, notes }) {
  await wait(1200);
  const items = materials({ sources, notes }).slice(0, 6);

  const summary = [
    `Summary of ${course.name}`,
    "",
    `Based on ${sources.length} file(s) and ${notes.length} note(s):`,
    ...items.map((item) => `- Key ideas from "${item}"`),
    "",
    "This is placeholder text. The real summary will come from the AI service.",
  ].join("\n");

  return { summary };
}

//   POST /api/courses/:id/quiz  { count }  ->  { questions: [...] }
export async function generateQuiz({ course, sources, notes, count = 10 }) {
  await wait(800 + count * 10); // ยิ่งจำนวนข้อมาก ยิ่งรอนาน เหมือนของจริง
  const topics = materials({ sources, notes });
  const correct = "It is a key concept in this course";
  const wrong = [
    "It is unrelated to this course",
    "It is only mentioned in passing",
    "It was removed from the syllabus",
  ];

  const questions = Array.from({ length: count }, (_, i) => {
    const answerIndex = i % 4;
    const choices = [...wrong];
    choices.splice(answerIndex, 0, correct); // วางข้อที่ถูกในตำแหน่งต่างกันไป
    const topic = topics.length > 0 ? topics[i % topics.length] : course.name;
    return {
      id: i,
      question: `Sample question ${i + 1}: which statement best matches "${topic}" in ${course.name}?`,
      choices,
      answerIndex,
      explanation:
        "Placeholder explanation. The real quiz will be generated from your files and notes.",
    };
  });

  return { questions };
}