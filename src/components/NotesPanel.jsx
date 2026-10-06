import { useState } from "react";
import { useNotes } from "../context/NotesContext";
import NoteEditor from "./NoteEditor";
import { useCourses } from "../context/CoursesContext";
import { exportCourseNotes } from "../utils/exportNotes";

export default function NotesPanel({ courseId }) {
  const { notes, saveNote, togglePin, deleteNote, loading, error } = useNotes();
  const { courses } = useCourses();
  const course = courses.find((c) => c.id === courseId);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [editing, setEditing] = useState(null); // null = ปิด, object = เปิดตัวแก้ไข

  const mine = notes.filter((n) => n.courseId === courseId);
  const allTags = [...new Set(mine.flatMap((n) => n.tags))];

  const q = query.trim().toLowerCase();
  const visible = mine
    .filter(
      (n) =>
        (!q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) &&
        (!activeTag || n.tags.includes(activeTag))
    )
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Notes ({mine.length})</h2>
        <div className="head-actions">
            <button
            className="btn-outline small-btn"
            disabled={mine.length === 0}
            onClick={() => exportCourseNotes(course, mine)}
            >
            Export .md
            </button>
            <button className="btn-primary small-btn" onClick={() => setEditing({ courseId })}>
            + เพิ่มโน้ต
            </button>
        </div>
        </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">กำลังโหลดโน้ต...</p>}

      <input
        className="search"
        placeholder="🔎 ค้นหาโน้ต..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {allTags.length > 0 && (
        <div className="tag-filter">
          <button className={`tag ${!activeTag ? "active" : ""}`} onClick={() => setActiveTag(null)}>
            ทั้งหมด
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              className={`tag ${activeTag === t ? "active" : ""}`}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="muted">{mine.length === 0 ? "ยังไม่มีโน้ต กด + เพิ่มโน้ต" : "ไม่พบโน้ต"}</p>
      ) : (
        <ul className="note-list">
          {visible.map((n) => (
            <li key={n.id} className={`note ${n.pinned ? "pinned" : ""}`}>
              <div className="note-top">
                <h4>{n.title}</h4>
                <div className="note-actions">
                  <button title="ปักหมุด" onClick={() => togglePin(n.id)}>{n.pinned ? "📌" : "📍"}</button>
                  <button title="แก้ไข" onClick={() => setEditing(n)}>✏️</button>
                  <button
                    title="ลบ"
                    onClick={() => confirm("ลบโน้ตนี้ใช่ไหม?") && deleteNote(n.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="note-body">{n.content}</p>
              <div className="note-tags">
                {n.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <NoteEditor initial={editing} onSave={saveNote} onClose={() => setEditing(null)} />
      )}
    </section>
  );
}