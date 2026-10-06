import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CoursesContext";
import { useNotes } from "../context/NotesContext";

export default function SearchModal({ onClose }) {
  const { courses, sources } = useCourses();
  const { notes } = useNotes();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const courseName = (id) => courses.find((c) => c.id === id)?.name ?? "";
    const list = [];

    courses
      .filter((c) => c.name.toLowerCase().includes(q))
      .forEach((c) => list.push({ key: `c-${c.id}`, type: "Course", title: c.name, detail: "", courseId: c.id }));

    notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.includes(q))
      )
      .forEach((n) => list.push({ key: `n-${n.id}`, type: "Note", title: n.title, detail: courseName(n.courseId), courseId: n.courseId }));

    sources
      .filter((s) => s.name.toLowerCase().includes(q))
      .forEach((s) => list.push({ key: `s-${s.id}`, type: "File", title: s.name, detail: courseName(s.courseId), courseId: s.courseId }));

    return list.slice(0, 20);
  }, [query, courses, notes, sources]);

  const open = (r) => {
    onClose();
    navigate(`/courses/${r.courseId}`);
  };

  const handleKey = (e) => {
    if (e.nativeEvent.isComposing) return; // กำลังพิมพ์ภาษาไทยอยู่ ยังไม่ต้องทำอะไร
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && results[active]) open(results[active]);
  };

  return (
    <div className="overlay search-overlay" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Search courses, notes and files..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={handleKey}
        />

        {query.trim() && results.length === 0 && (
          <p className="muted small search-empty">No results for "{query.trim()}".</p>
        )}

        {results.length > 0 && (
          <ul className="results">
            {results.map((r, i) => (
              <li key={r.key}>
                <button
                  className={`result ${i === active ? "active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => open(r)}
                >
                  <span className="tag">{r.type}</span>
                  <span className="result-title">{r.title}</span>
                  {r.detail && <span className="muted small">{r.detail}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}