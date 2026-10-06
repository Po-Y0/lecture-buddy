import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CoursesContext";
import { useNotes } from "../context/NotesContext";

const ACCEPT = ".pdf,.txt,.md,.docx,.pptx";

export default function QuickAddModal({ onClose }) {
  // Hook ทุกตัวอยู่ก่อน return เสมอ
  const { courses, addSources } = useCourses();
  const { saveNote } = useNotes();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const lastId = localStorage.getItem("lastCourseId");
  const [courseId, setCourseId] = useState(
    courses.find((c) => c.id === lastId)?.id ?? courses[0]?.id ?? ""
  );
  const [mode, setMode] = useState("note"); // "note" | "file"
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  // ยังไม่มีวิชา: พาไปสร้างวิชาก่อน
  if (courses.length === 0) {
    return (
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>Add a course first</h2>
          <p className="muted">Notes and files belong to a course. Create one to get started.</p>
          <div className="row end">
            <button className="btn-outline" onClick={onClose}>Close</button>
            <button
              className="btn-primary"
              onClick={() => { onClose(); navigate("/courses"); }}
            >
              Go to My Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canSave = mode === "note" ? title.trim().length > 0 : files.length > 0;

  const addFiles = (list) => {
  const picked = Array.from(list);               // คัดลอกทันที ก่อนที่ช่องเลือกไฟล์จะถูกล้าง
  setFiles((prev) => [...prev, ...picked]);
};
  const removeFile = (index) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const submit = (e) => {
    e.preventDefault();
    if (!canSave) return;

    if (mode === "note") {
      saveNote({ courseId, title: title.trim(), content, tags: [] });
    } else {
      addSources(courseId, files);
    }

    localStorage.setItem("lastCourseId", courseId);
    onClose();
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Quick add</h2>

        <label className="field-label" htmlFor="qa-course">Course</label>
        <select id="qa-course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>

        <div className="tabs" role="tablist">
          <button
            type="button" role="tab" aria-selected={mode === "note"}
            className={`tab ${mode === "note" ? "active" : ""}`}
            onClick={() => setMode("note")}
          >
            Note
          </button>
          <button
            type="button" role="tab" aria-selected={mode === "file"}
            className={`tab ${mode === "file" ? "active" : ""}`}
            onClick={() => setMode("file")}
          >
            File
          </button>
        </div>

        {mode === "note" ? (
          <>
            <input
              autoFocus
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              rows={6}
              placeholder="เขียนโน้ตที่นี่..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </>
        ) : (
          <>
            <div
              className={`dropzone ${dragging ? "dragging" : ""}`}
              onClick={() => inputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            >
              <p><strong>ลากไฟล์มาวางที่นี่</strong></p>
              <p className="muted small">หรือคลิกเพื่อเลือกไฟล์ (PDF, DOCX, PPTX, TXT, MD)</p>
              <input
                ref={inputRef} type="file" multiple accept={ACCEPT} hidden
                onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
              />
            </div>

            {files.length > 0 && (
              <ul className="file-list">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <span>📄 {f.name}</span>
                    <button type="button" className="icon-btn" aria-label={`Remove ${f.name}`} onClick={() => removeFile(i)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="row end">
          <button type="button" className="btn-outline" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="btn-primary" disabled={!canSave}>
            {mode === "note" ? "บันทึก" : "เพิ่มไฟล์"}
          </button>
        </div>
      </form>
    </div>
  );
}