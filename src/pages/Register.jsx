import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/courses" replace />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    if (form.password !== form.confirm) return setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");

    const result = register(form.name.trim(), form.email.trim(), form.password);
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
        <input type="password" placeholder="Password (อย่างน้อย 6 ตัว)" value={form.password} onChange={update("password")} required />
        <input type="password" placeholder="Confirm password" value={form.confirm} onChange={update("confirm")} required />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary full">Register</button>

        <p className="switch">
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </form>
    </div>
  );
}