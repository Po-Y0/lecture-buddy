import { useState } from "react";

const COUNTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function QuizSetupModal({ course, loading, onStart, onClose }) {
  const [count, setCount] = useState(10);

  return (
    <div className="overlay" onClick={loading ? undefined : onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>สร้างแบบทดสอบ</h2>
        <p className="muted small">{course.icon} {course.name}</p>

        <p className="field-label" id="count-label">จำนวนข้อ</p>
        <div className="count-grid" role="radiogroup" aria-labelledby="count-label">
          {COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={count === n}
              className={`count-option ${count === n ? "selected" : ""}`}
              disabled={loading}
              onClick={() => setCount(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="muted small">
          ยิ่งจำนวนข้อมาก ยิ่งใช้เวลาสร้างนานขึ้น และควรมีไฟล์หรือโน้ตมากพอ
          เพื่อไม่ให้คำถามซ้ำกัน
        </p>

        <div className="row end">
          <button className="btn-outline" onClick={onClose} disabled={loading}>
            ยกเลิก
          </button>
          <button className="btn-primary" onClick={() => onStart(count)} disabled={loading}>
            {loading ? "กำลังเตรียม..." : `เริ่มทำ ${count} ข้อ`}
          </button>
        </div>
      </div>
    </div>
  );
}