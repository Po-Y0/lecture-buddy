import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import { useCourses } from "../context/CoursesContext";

export default function PinnedNotes() {
  const { notes, togglePin, loading, error } = useNotes();
  const { courses } = useCourses();
  const navigate = useNavigate();

  // จัดกลุ่มตามวิชา เอาเฉพาะวิชาที่มีโน้ตปักหมุด
  const groups = courses
    .map((course) => ({
      course,
      list: notes
        .filter((n) => n.pinned && n.courseId === course.id)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    }))
    .filter((g) => g.list.length > 0);

  const total = groups.reduce((sum, g) => sum + g.list.length, 0);

  return (
    <div>
      <h1 className="page-title">Pinned Notes</h1>
      <p className="subtitle">
        โน้ตที่ปักหมุดไว้{total > 0 ? ` · ${total} รายการ` : ""}
      </p>
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">กำลังโหลดโน้ต...</p>}

      {!loading && groups.length === 0 ? (
        <p className="empty">
          ยังไม่มีโน้ตที่ปักหมุด กดไอคอนหมุดที่โน้ตในหน้าวิชาเพื่อเก็บไว้ที่นี่
        </p>
      ) : (
        groups.map(({ course, list }) => (
          <section key={course.id} className="pin-group" style={{ "--accent": course.color }}>
            <div className="pin-group-head">
              <div className="row-icon">{course.icon}</div>
              <div className="pin-group-title">
                <h2>{course.name}</h2>
                <span className="muted small">{list.length} โน้ต</span>
              </div>
              <button
                className="btn-soft small-btn"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                เปิดวิชา
              </button>
            </div>

            <div className="pin-grid">
              {list.map((n) => (
                <article key={n.id} className="pin-card">
                  <div className="note-top">
                    <h3>{n.title}</h3>
                    <button
                      className="icon-btn"
                      aria-label="เลิกปักหมุด"
                      title="เลิกปักหมุด"
                      onClick={() => togglePin(n.id)}
                    >
                      📌
                    </button>
                  </div>

                  {n.content && <p className="note-body">{n.content}</p>}

                  {n.tags.length > 0 && (
                    <div className="note-tags">
                      {n.tags.map((t) => (
                        <span key={t} className="tag">#{t}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}