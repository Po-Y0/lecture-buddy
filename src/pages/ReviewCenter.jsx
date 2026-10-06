import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CoursesContext";
import { useNotes } from "../context/NotesContext";
import { generateQuiz } from "../api/ai";
import QuizModal from "../components/QuizModal";
import QuizSetupModal from "../components/QuizSetupModal";
import { getQuizResults, addQuizResult, latestResultFor } from "../utils/quizResults";

// กี่วันหลังเพิ่ม/ทบทวนล่าสุด โน้ตถึงจะเข้าคิว (ตอนทดสอบเปลี่ยนเป็น 0 ได้)
const REVIEW_AFTER_DAYS = 3;
const DAY = 24 * 60 * 60 * 1000;

export default function ReviewCenter() {
  const { courses, sources, loading: coursesLoading } = useCourses();
  const { notes, markReviewed, loading: notesLoading, error: noteError } = useNotes();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [setupCourse, setSetupCourse] = useState(null); // วิชาที่กำลังตั้งค่าแบบทดสอบ
  const [active, setActive] = useState(null); // { course, quizId, questions }
  const [error, setError] = useState("");
  const [now] = useState(() => Date.now());

  useEffect(() => {
    let activeRequest = true;
    getQuizResults()
      .then((history) => {
        if (activeRequest) setResults(history);
      })
      .catch((requestError) => {
        if (activeRequest) setError(requestError.message);
      });
    return () => {
      activeRequest = false;
    };
  }, []);

  // ---------- คิวทบทวน ----------
  const scheduled = notes.map((note) => {
    const since = note.lastReviewedAt ?? note.createdAt;
    return { note, since, dueAt: since + REVIEW_AFTER_DAYS * DAY };
  });
  const queue = scheduled.filter((x) => x.dueAt <= now).sort((a, b) => a.dueAt - b.dueAt);
  const upcoming = scheduled.filter((x) => x.dueAt > now).sort((a, b) => a.dueAt - b.dueAt);
  const nextUp = upcoming[0];

  const courseOf = (id) => courses.find((c) => c.id === id);

  const agoText = ({ note, since }) => {
    const days = Math.floor((now - since) / DAY);
    const when = days === 0 ? "วันนี้" : `${days} วันที่แล้ว`;
    return `${note.lastReviewedAt ? "ทบทวนล่าสุด" : "เพิ่มเมื่อ"} ${when}`;
  };

  const dueText = (dueAt) => {
    const days = Math.ceil((dueAt - now) / DAY);
    return days <= 1 ? "ถึงกำหนดพรุ่งนี้" : `ถึงกำหนดในอีก ${days} วัน`;
  };

  const renderRow = (item, subtitle) => {
    const c = courseOf(item.note.courseId);
    return (
      <li key={item.note.id} className="review-row">
        <div className="review-info">
          <strong>{item.note.title}</strong>
          <span className="muted small">
            {c ? `${c.icon} ${c.name}` : "ไม่พบวิชา"} · {subtitle}
          </span>
        </div>
        <div className="review-actions">
          <button
            className="btn-outline small-btn"
            onClick={() => navigate(`/courses/${item.note.courseId}`)}
          >
            เปิดวิชา
          </button>
          <button className="btn-primary small-btn" onClick={() => markReviewed(item.note.id)}>
            ทบทวนแล้ว
          </button>
        </div>
      </li>
    );
  };

  // ---------- ฝึกทำข้อสอบ ----------
  const startQuiz = async (count) => {
    const course = setupCourse;
    setLoadingId(course.id);
    setError("");
    try {
      const quiz = await generateQuiz({ course, count });
      setActive({ course, quizId: quiz.quizId, questions: quiz.questions });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSetupCourse(null);
      setLoadingId(null);
    }
  };

  const handleComplete = async (answers) => {
    const result = await addQuizResult({ quizId: active.quizId, answers });
    setResults((previous) => [result, ...previous]);
    return result;
  };

  const materialCount = (courseId) =>
    sources.filter((s) => s.courseId === courseId).length +
    notes.filter((n) => n.courseId === courseId).length;

  // ---------- ตัวเลขสรุป ----------
  const validResults = results.filter((r) => courses.some((c) => c.id === r.courseId));
  const average = validResults.length
    ? Math.round(
        (validResults.reduce((sum, r) => sum + r.score / r.total, 0) / validResults.length) * 100
      )
    : null;

  return (
    <div>
      <h1 className="page-title">Review Center</h1>
      <p className="subtitle">ทบทวนเนื้อหา และทดสอบความเข้าใจ</p>

      {(coursesLoading || notesLoading) && <p className="muted">กำลังโหลดข้อมูล...</p>}
      <div className="stats">
        <div className="stat"><strong>{queue.length}</strong><span>ถึงเวลาทบทวน</span></div>
        <div className="stat"><strong>{upcoming.length}</strong><span>กำลังจะถึง</span></div>
        <div className="stat"><strong>{validResults.length}</strong><span>ครั้งที่ทำแบบทดสอบ</span></div>
        <div className="stat"><strong>{average === null ? "-" : `${average}%`}</strong><span>คะแนนเฉลี่ย</span></div>
      </div>

      {/* ---------- คิวทบทวน ---------- */}
      <section className="panel review-section">
        <div className="section-head">
          <h2>คิวทบทวน</h2>
          {queue.length > 0 && <span className="tag">{queue.length}</span>}
        </div>

        {notes.length === 0 ? (
          <p className="muted">ยังไม่มีโน้ต ใช้ Quick add เพื่อจดโน้ตแรกของคุณ</p>
        ) : queue.length === 0 ? (
          <div className="queue-empty">
            <strong>ทบทวนครบแล้ว ตอนนี้ไม่มีโน้ตค้าง</strong>
            <p className="muted small">
              โน้ตจะเข้าคิวเมื่อผ่านไป {REVIEW_AFTER_DAYS} วันหลังจากเพิ่มหรือทบทวนล่าสุด
              {nextUp && ` โน้ตถัดไป: "${nextUp.note.title}" ${dueText(nextUp.dueAt)}`}
            </p>
          </div>
        ) : (
          <ul className="row-list">{queue.map((item) => renderRow(item, agoText(item)))}</ul>
        )}

        {upcoming.length > 0 && (
          <details className="upcoming">
            <summary>กำลังจะถึง ({upcoming.length})</summary>
            <ul className="row-list">
              {upcoming.map((item) => renderRow(item, dueText(item.dueAt)))}
            </ul>
          </details>
        )}
      </section>

      {/* ---------- ฝึกทำข้อสอบ ---------- */}
      <section className="panel review-section">
        <h2>ฝึกทำข้อสอบ</h2>
        <p className="muted small">สร้างแบบทดสอบจากไฟล์และโน้ตของแต่ละวิชา</p>
        {(error || noteError) && <p className="error">{error || noteError}</p>}

        {courses.length === 0 ? (
          <p className="muted">เพิ่มวิชาก่อนเพื่อเริ่มฝึกทำข้อสอบ</p>
        ) : (
          <ul className="row-list">
            {courses.map((c) => {
              const last = latestResultFor(results, c.id);
              const hasMaterial = materialCount(c.id) > 0;
              return (
                <li key={c.id} className="review-row" style={{ "--accent": c.color }}>
                  <div className="row-icon">{c.icon}</div>
                  <div className="review-info">
                    <strong>{c.name}</strong>
                    <span className="muted small">
                      {last
                        ? `คะแนนล่าสุด ${last.score}/${last.total} · ${new Date(last.takenAt).toLocaleDateString()}`
                        : hasMaterial
                        ? "ยังไม่เคยทำ"
                        : "เพิ่มไฟล์หรือโน้ตก่อน"}
                    </span>
                  </div>
                  <div className="review-actions">
                    <button
                      className="btn-outline small-btn"
                      disabled={!hasMaterial}
                      onClick={() => setSetupCourse(c)}
                    >
                      สร้างแบบทดสอบ
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {setupCourse && (
        <QuizSetupModal
          course={setupCourse}
          loading={loadingId !== null}
          onStart={startQuiz}
          onClose={() => setSetupCourse(null)}
        />
      )}

      {active && (
        <QuizModal
          questions={active.questions}
          onClose={() => setActive(null)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}