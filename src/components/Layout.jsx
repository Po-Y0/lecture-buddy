import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import QuickAddModal from "./QuickAddModal";
import SearchModal from "./SearchModal";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { error: authError } = useAuth();
  const [quickOpen, setQuickOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K / Ctrl+K เปิด-ปิดการค้นหา
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey); // ล้างตัวดักเมื่อ component หายไป
  }, []);

  return (
    <div className="layout">
      <Sidebar
        onQuickAdd={() => setQuickOpen(true)}
        onSearch={() => setSearchOpen(true)}
      />

      <main className="content">
        {authError && <p className="error">{authError}</p>}
        <Outlet />
      </main>

      <button className="fab" aria-label="Quick add" onClick={() => setQuickOpen(true)}>+</button>

      {quickOpen && <QuickAddModal onClose={() => setQuickOpen(false)} />}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}