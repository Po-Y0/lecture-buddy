import { useRef, useState } from "react";

export default function QuizModal({ questions, onClose, onComplete }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const savingRef = useRef(false);

  const total = questions.length;
  const q = questions[index];
  const hasAnswer = selected !== null;

  const choose = (i) => {
    if (hasAnswer) return;
    setSelected(i);
    setAnswers((previous) => [...previous, { questionId: q.id, answerIndex: i }]);
    setAnswered((n) => n + 1);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const finish = async () => {
    if (savingRef.current) return;
    if (answered > 0 && onComplete) {
      savingRef.current = true;
      setSaving(true);
      setError("");
      try {
        const result = await onComplete(answers);
        if (result) {
          setScore(result.score);
          setAnswered(result.total);
        }
      } catch (requestError) {
        setError(requestError.message);
        savingRef.current = false;
        setSaving(false);
        return;
      }
      savingRef.current = false;
      setSaving(false);
    }
    setDone(true);
  };

  const next = async () => {
    if (index + 1 >= total) {
      await finish();
    } else {
      setIndex(index + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered(0);
    setAnswers([]);
    setError("");
    setDone(false);
  };

  return (
    // ระหว่างทำข้อสอบ คลิกพื้นหลังจะไม่ปิด กันความคืบหน้าหายโดยไม่ตั้งใจ
    <div className="overlay" onClick={done ? onClose : undefined}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <>
            <h2>ทำแบบทดสอบเสร็จแล้ว</h2>
            <p className="quiz-score">{score} / {answered}</p>
            <p className="muted">
              {answered > 0 ? `ตอบถูก ${Math.round((score / answered) * 100)}%` : "ยังไม่ได้ตอบคำถาม"}
              {answered < total && ` · ตอบแล้ว ${answered} จาก ${total} ข้อ`}
            </p>
            <div className="row end">
              <button className="btn-outline" onClick={restart} disabled={saving}>ทำอีกครั้ง</button>
              <button className="btn-primary" onClick={onClose} disabled={saving}>ปิด</button>
            </div>
          </>
        ) : (
          <>
            <div className="quiz-top">
              <span className="muted small">ข้อที่ {index + 1} จาก {total}</span>
              <span className="muted small">ตอบถูก {score}</span>
            </div>
            <div className="quiz-progress">
              <div className="quiz-progress-bar" style={{ width: `${(answered / total) * 100}%` }} />
            </div>

            <h2>{q.question}</h2>

            <div className="choices">
              {q.choices.map((c, i) => {
                let state = "";
                if (hasAnswer && i === q.answerIndex) state = "correct";
                else if (hasAnswer && i === selected) state = "wrong";
                return (
                  <button
                    key={i}
                    className={`choice ${state}`}
                    disabled={hasAnswer}
                    onClick={() => choose(i)}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {hasAnswer && <p className="explain muted">{q.explanation}</p>}
            {error && <p className="error">{error}</p>}

            <div className="row end">
              {answered === 0 ? (
                <button className="btn-outline" onClick={onClose} disabled={saving}>ยกเลิก</button>
              ) : (
                <button className="btn-outline" onClick={finish} disabled={saving}>
                  {saving ? "กำลังบันทึก..." : "จบการทดสอบ"}
                </button>
              )}
              <button className="btn-primary" disabled={!hasAnswer || saving} onClick={next}>
                {index + 1 >= total ? "ดูคะแนน" : "ข้อถัดไป"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}