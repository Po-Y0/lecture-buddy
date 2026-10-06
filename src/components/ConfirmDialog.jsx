import { useEffect } from "react";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = "ยกเลิก",
  onConfirm,
  onCancel,
}) {
  // กด Esc เพื่อยกเลิก
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="overlay" onClick={onCancel}>
      <div
        className="modal confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title">{title}</h2>
        {message && <p className="muted">{message}</p>}

        <div className="row end">
          {/* ให้โฟกัสที่ปุ่มยกเลิกก่อน กัน Enter เผลอทำให้ออกจากระบบ */}
          <button className="btn-outline" onClick={onCancel} autoFocus>
            {cancelLabel}
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}