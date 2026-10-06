import { useState } from "react";

export default function NoteEditor({ initial, onSave, onClose }) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [tags, setTags] = useState(initial.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const handleTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // กัน Enter ไป submit ฟอร์ม
      addTag();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      await onSave({ ...initial, title: title.trim(), content, tags });
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal wide" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{initial.id ? "แก้ไขโน้ต" : "เพิ่มโน้ต"}</h2>

        <input autoFocus placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <textarea
          rows={8}
          placeholder="เขียนโน้ตที่นี่..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="tag-box">
          {tags.map((t) => (
            <span key={t} className="tag">
              #{t}
              <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>✕</button>
            </span>
          ))}
          <input
            placeholder="พิมพ์ tag แล้วกด Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKey}
            onBlur={addTag}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="row end">
          <button type="button" className="btn-outline" onClick={onClose} disabled={saving}>ยกเลิก</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </div>
  );
}