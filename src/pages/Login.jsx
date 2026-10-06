import { useState } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/courses" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email.trim(), password);
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

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary full">Log in</button>

        <p className="switch">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
        </p>
      </form>
    </div>
  );
}