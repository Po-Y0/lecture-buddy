import { useState } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login, initializing, busy, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (initializing) return <p className="muted">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>;
  if (user) return <Navigate to="/courses" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email.trim(), password);
    if (result.ok) navigate("/courses");
    else setError(result.error);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="brand">Lecture Buddy</h1>
        <p className="brand-sub">โน้ต สรุป และแบบทดสอบ</p>

        {location.state?.registered && (
          <p className="success">สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ</p>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {(error || authError) && <p className="error">{error || authError}</p>}

        <button type="submit" className="btn-primary full" disabled={busy}>
          {busy ? "กำลังเข้าสู่ระบบ..." : "Log in"}
        </button>

        <p className="switch">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
        </p>
      </form>
    </div>
  );
}