// ตัดอักขระที่ใช้ตั้งชื่อไฟล์ไม่ได้ออก
const safeName = (s) => s.replace(/[\\/:*?"<>|]+/g, "-").trim() || "notes";

export function notesToMarkdown(course, notes) {
  const sorted = [...notes].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || a.createdAt - b.createdAt
  );

  const lines = [`# ${course.name}`, ""];
  sorted.forEach((n) => {
    lines.push(`## ${n.pinned ? "📌 " : ""}${n.title}`);
    if (n.tags.length) lines.push("", n.tags.map((t) => `#${t}`).join(" "));
    lines.push("", n.content || "", "");
  });
  return lines.join("\n");
}

export function downloadText(filename, text, type = "text/markdown") {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportCourseNotes(course, notes) {
  downloadText(`${safeName(course.name)}-notes.md`, notesToMarkdown(course, notes));
}