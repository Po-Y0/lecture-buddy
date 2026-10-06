import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { user, register, initializing, busy, error: authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  if (initializing) return <p className="muted">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>;
  if (user) return <Navigate to="/courses" replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      form.password.length < 8 ||
      !/\p{L}/u.test(form.password) ||
      !/\d/.test(form.password)
    ) {
      return setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมีทั้งตัวอักษรกับตัวเลข");
    }
    if (form.password !== form.confirm) return setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");

    const result = await register(form.name.trim(), form.email.trim(), form.password);
    if (result.ok) navigate("/login", { state: { registered: true } });
    else setError(result.error);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="brand">Create account</h1>
        <p className="brand-sub">เริ่มใช้งาน Lecture Buddy</p>

        <input placeholder="Name" value={form.name} onChange={update("name")} required />
        <input type="email" placeholder="Email" value={form.email} onChange={update("email")} required />
        <input type="password" placeholder="Password (อย่างน้อย 8 ตัว มีตัวอักษรและตัวเลข)" value={form.password} onChange={update("password")} required />
        <input type="password" placeholder="Confirm password" value={form.confirm} onChange={update("confirm")} required />

        {(error || authError) && <p className="error">{error || authError}</p>}

        <button type="submit" className="btn-primary full" disabled={busy}>
          {busy ? "กำลังสมัครสมาชิก..." : "Register"}
        </button>

        <p className="switch">
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </form>
    </div>
  );
}