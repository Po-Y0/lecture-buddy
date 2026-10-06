import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course, sourceCount, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="card" style={{ "--accent": course.color }}>
      <div className="card-top">
        <div className="card-icon">{course.icon}</div>

        <div className="menu-wrap">
          <button className="icon-btn" aria-label="Course options" onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
          {menuOpen && (
            <div className="menu">
              <button onClick={() => { setMenuOpen(false); onEdit(course); }}>แก้ไข</button>
              <button onClick={() => { setMenuOpen(false); onDelete(course.id); }}>ลบ</button>
            </div>
          )}
        </div>
      </div>

      <h3 className="card-title">{course.name}</h3>
      <p className="muted small">{sourceCount} ไฟล์</p>

      <button className="btn-outline full card-action" onClick={() => navigate(`/courses/${course.id}`)}>
        เปิด
      </button>
    </div>
  );
}