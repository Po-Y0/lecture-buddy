import { useState } from "react";

const ICONS = ["📘", "💻", "🗄️", "🌐", "🧠", "📊", "🔬", "🧮", "🎨", "⚙️", "📐", "🤖"];
const COLORS = ["#4c1d95", "#2f6fb5", "#3a9d6e", "#d97706", "#dc2626", "#db2777", "#0891b2", "#475569"];

export default function CourseModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial ?? { name: "", color: COLORS[0], icon: ICONS[0] }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, name: form.name.trim() });
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{initial ? "แก้ไขวิชา" : "เพิ่มวิชา"}</h2>

        <input
          autoFocus
          placeholder="ชื่อวิชา"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <p className="field-label">ไอคอน</p>
        <div className="picker">
          {ICONS.map((ic) => (
            <button
              type="button"
              key={ic}
              className={`icon-option ${form.icon === ic ? "selected" : ""}`}
              onClick={() => setForm({ ...form, icon: ic })}
            >
              {ic}
            </button>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <p className="field-label">สี</p>
        <div className="picker">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              className={`color-option ${form.color === c ? "selected" : ""}`}
              style={{ background: c }}
              onClick={() => setForm({ ...form, color: c })}
            />
          ))}
        </div>

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