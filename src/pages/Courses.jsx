import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import CourseModal from "../components/CourseModal";
import { useCourses } from "../context/CoursesContext";
import { useNotes } from "../context/NotesContext";

export default function Courses() {
  const { courses, sources, saveCourse, deleteCourse } = useCourses();
  const { notes, deleteNotesByCourse } = useNotes();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // วิชาที่เปิดล่าสุด (บันทึกไว้ตอนเข้าหน้าวิชา)
  const last = courses.find((c) => c.id === localStorage.getItem("lastCourseId"));
  const lastNote = last
    ? notes.filter((n) => n.courseId === last.id).sort((a, b) => b.updatedAt - a.updatedAt)[0]
    : null;

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (course) => { setEditing(course); setModalOpen(true); };

  const handleDelete = (id) => {
    if (confirm("ลบวิชานี้ รวมถึงไฟล์และโน้ตทั้งหมดในวิชาใช่ไหม?")) {
      deleteCourse(id);
      deleteNotesByCourse(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Courses</h1>
          <p className="subtitle">จัดการวิชาและเนื้อหาการเรียน</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add course</button>
      </div>

      {last && (
        <div className="resume" style={{ "--accent": last.color }}>
          <div className="card-icon">{last.icon}</div>
          <div className="resume-text">
            <strong>{last.name}</strong>
            {lastNote && <span className="muted small">Latest note: {lastNote.title}</span>}
          </div>
          <button className="btn-soft" onClick={() => navigate(`/courses/${last.id}`)}>
            Continue
          </button>
        </div>
      )}

      {courses.length === 0 ? (
        <p className="empty">ยังไม่มีวิชา เพิ่มวิชาแรกเพื่อเริ่มจัดเก็บโน้ตการเรียน</p>
      ) : (
        <div className="grid">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              sourceCount={sources.filter((s) => s.courseId === c.id).length}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <CourseModal initial={editing} onSave={saveCourse} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}