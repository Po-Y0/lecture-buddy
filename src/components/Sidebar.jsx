import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ClipboardCheck,
  Pin,
  Plus,
  Search,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";

// ตั้งค่าไอคอนที่เดียว: ขนาดและความหนาเส้นเท่ากันทั้งเมนู
const ICON = { size: 18, strokeWidth: 1.75, "aria-hidden": true };

export default function Sidebar({ onQuickAdd, onSearch }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = () => {
    setConfirmOpen(false);
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <>
      <aside className="sidebar">
        <div className="side-top">
          <div className="brand-block">
            <h2 className="brand">Lecture Buddy</h2>
            <p className="brand-sub">โน้ต สรุป และแบบทดสอบ</p>
          </div>

          <button className="btn-primary full side-cta" onClick={onQuickAdd}>
            <Plus {...ICON} strokeWidth={2.25} />
            <span>Quick add</span>
          </button>

          <button className="search-trigger" onClick={onSearch}>
            <span className="trigger-label">
              <Search {...ICON} />
              <span>Search</span>
            </span>
            <kbd>⌘K</kbd>
          </button>

          <nav className="nav">
            <NavLink to="/courses" className={linkClass}>
              <GraduationCap {...ICON} />
              <span>My Courses</span>
            </NavLink>
            <NavLink to="/review" className={linkClass}>
              <ClipboardCheck {...ICON} />
              <span>Review Center</span>
            </NavLink>
            <NavLink to="/pinned" className={linkClass}>
              <Pin {...ICON} />
              <span>Pinned Notes</span>
            </NavLink>
          </nav>
        </div>

        <div className="side-bottom nav">
          <a className="nav-link" href="#">
            <CircleHelp {...ICON} />
            <span>Help</span>
          </a>
          <button className="nav-link as-button" onClick={() => setConfirmOpen(true)}>
            <LogOut {...ICON} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {confirmOpen && (
        <ConfirmDialog
          title="ต้องการออกจากระบบหรือไม่?"
          message="ข้อมูลของคุณยังอยู่ และกลับเข้าสู่ระบบได้ทุกเมื่อ"
          confirmLabel="ออกจากระบบ"
          onConfirm={handleLogout}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}