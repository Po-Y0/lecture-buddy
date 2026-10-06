import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const getUsers = () => {
  try { return JSON.parse(localStorage.getItem("users")) ?? []; }
  catch { return []; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  });

  // ทุกฟังก์ชันคืน { ok, error } เพื่อให้หน้าจอแสดงข้อความได้
  const register = (name, email, password) => {
    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: "อีเมลนี้ถูกใช้งานแล้ว" };
    }
    users.push({ id: crypto.randomUUID(), name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    return { ok: true };
  };

  const login = (email, password) => {
    const found = getUsers().find((u) => u.email === email && u.password === password);
    if (!found) return { ok: false, error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };

    const safeUser = { id: found.id, name: found.name, email: found.email }; // ไม่เก็บรหัสผ่านใน session
    localStorage.setItem("user", JSON.stringify(safeUser));
    setUser(safeUser);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);