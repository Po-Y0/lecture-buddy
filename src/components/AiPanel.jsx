import { useState } from "react";
import { summarizeCourse, generateQuiz } from "../api/ai";
import { useNotes } from "../context/NotesContext";
import { addQuizResult } from "../utils/quizResults";
import QuizModal from "./QuizModal";
import QuizSetupModal from "./QuizSetupModal";

export default function AiPanel({ course, sources }) {
  const { notes, saveNote } = useNotes();
  const [loading, setLoading] = useState(null); // "summary" | "quiz" | null
  const [summary, setSummary] = useState("");
  const [saved, setSaved] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState("");

  const myNotes = notes.filter((n) => n.courseId === course.id);
  const hasMaterial = sources.length + myNotes.length > 0;
  const input = { course, sources, notes: myNotes };

  const runSummary = async () => {
    setLoading("summary");
    setError("");
    try {
      const result = await summarizeCourse(input);
      setSummary(result.summary);
      setSaved(false);
    } catch {
      setError("เกิดข้อผิดพลาด ลองอีกครั้ง");
    } finally {
      setLoading(null);
    }
  };

  const startQuiz = async (count) => {
    setLoading("quiz");
    setError("");
    try {
      const result = await generateQuiz({ ...input, count });
      setQuestions(result.questions);
    } catch {
      setError("เตรียมแบบทดสอบไม่สำเร็จ ลองอีกครั้ง");
    } finally {
      setSetupOpen(false);
      setLoading(null);
    }
  };

  const saveSummary = () => {
    saveNote({
      courseId: course.id,
      title: `สรุปโดย AI (${new Date().toLocaleDateString()})`,
      content: summary,
      tags: ["ai-summary"],
    });
    setSaved(true);
  };

  return (
    <section className="panel ai-panel">
      <h2>เครื่องมือ AI ช่วยเรียน</h2>
      <p className="muted small">
        โหมดทดลอง: ผลลัพธ์เป็นข้อความตัวอย่างจนกว่าจะเชื่อมต่อบริการ AI
      </p>

      <div className="ai-actions">
        <button
          className="btn-primary"
          disabled={!hasMaterial || loading !== null}
          onClick={runSummary}
        >
          {loading === "summary" ? "กำลังสรุป..." : "สรุปเนื้อหา"}
        </button>
        <button
          className="btn-outline"
          disabled={!hasMaterial || loading !== null}
          onClick={() => setSetupOpen(true)}
        >
          สร้างแบบทดสอบ
        </button>
      </div>

      {!hasMaterial && (
        <p className="muted small ai-hint">
          เพิ่มไฟล์หรือโน้ตในวิชานี้ก่อนจึงจะใช้เครื่องมือ AI ได้
        </p>
      )}
      {error && <p className="error">{error}</p>}

      {summary && (
        <div className="ai-result">
          <p>{summary}</p>
          <div className="row end">
            <button className="btn-outline small-btn" onClick={saveSummary} disabled={saved}>
              {saved ? "บันทึกเป็นโน้ตแล้ว" : "บันทึกเป็นโน้ต"}
            </button>
          </div>
        </div>
      )}

      {setupOpen && (
        <QuizSetupModal
          course={course}
          loading={loading === "quiz"}
          onStart={startQuiz}
          onClose={() => setSetupOpen(false)}
        />
      )}

      {questions && (
        <QuizModal
          questions={questions}
          onClose={() => setQuestions(null)}
          onComplete={(score, total) => addQuizResult({ courseId: course.id, score, total })}
        />
      )}
    </section>
  );
}