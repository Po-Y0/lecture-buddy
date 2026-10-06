import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCourses } from "../context/CoursesContext";
import NotesPanel from "../components/NotesPanel";
import AiPanel from "../components/AiPanel";
import { sourceDownloadUrl } from "../api/client";

const ACCEPT = ".pdf,.txt,.md,.docx,.pptx";

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function CourseDetail() {
  // Hook ทุกตัวอยู่ในฟังก์ชัน และอยู่ก่อน return ตัวแรก
  const { id } = useParams();
  const { courses, sources, addSources, removeSource, loading } = useCourses();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const course = courses.find((c) => c.id === id);

  useEffect(() => {
    if (course) localStorage.setItem("lastCourseId", id);
  }, [id, course]);

  if (loading) return <p className="muted">กำลังโหลดวิชา...</p>;
  if (!course) return <p>ไม่พบวิชานี้ <Link to="/courses">กลับ</Link></p>;

  const mySources = sources.filter((s) => s.courseId === id);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList);
    if (!files.length) return;
    setError("");
    setUploading(true);
    try {
      await addSources(id, files);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveSource = async (sourceId) => {
    setError("");
    try {
      await removeSource(sourceId);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <Link to="/courses" className="back">← My Courses</Link>

      <div className="detail-head">
        <div className="card-icon" style={{ "--accent": course.color }}>{course.icon}</div>
        <h1 className="page-title">{course.name}</h1>
      </div>

      <AiPanel course={course} sources={mySources} />
        
      <div className="detail-layout">
        <section className="panel">
          <h2>Sources ({mySources.length})</h2>
          {error && <p className="error">{error}</p>}
          {uploading && <p className="muted">กำลังอัปโหลดและประมวลผลไฟล์...</p>}

          <div
            className={`dropzone ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current.click()}
          >
            <p><strong>ลากไฟล์มาวางที่นี่</strong></p>
            <p className="muted small">หรือคลิกเพื่อเลือกไฟล์ (PDF, DOCX, PPTX, TXT, MD)</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ACCEPT}
              hidden
              disabled={uploading}
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
            />
          </div>

          <ul className="source-list">
            {mySources.map((s) => (
              <li key={s.id}>
                <span>📄 {s.name}</span>
                <span className="muted small">{formatSize(s.size)}</span>
                <a className="btn-outline small-btn" href={sourceDownloadUrl(s.id)} download={s.name}>
                  Download
                </a>
                <button className="icon-btn" aria-label={`Remove ${s.name}`} onClick={() => handleRemoveSource(s.id)}>✕</button>
              </li>
            ))}
          </ul>
        </section>

        <NotesPanel courseId={id} />
      </div>
    </div>
  );
}