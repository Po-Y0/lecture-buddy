import { createContext, useContext, useEffect, useState } from "react";

const NotesContext = createContext(null);

const load = () => {
  try { return JSON.parse(localStorage.getItem("notes")) ?? []; }
  catch { return []; }
};

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(load);

  useEffect(() => localStorage.setItem("notes", JSON.stringify(notes)), [notes]);

  // data มี id = แก้ไข, ไม่มี = สร้างใหม่
  const saveNote = (data) => {
    const now = Date.now();
    setNotes((prev) =>
      data.id
        ? prev.map((n) => (n.id === data.id ? { ...n, ...data, updatedAt: now } : n))
        : [...prev, { ...data, id: crypto.randomUUID(), pinned: false, createdAt: now, updatedAt: now }]
    );
  };

  const togglePin = (id) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const markReviewed = (id) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, lastReviewedAt: Date.now() } : n)));

  const deleteNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const deleteNotesByCourse = (courseId) =>
    setNotes((prev) => prev.filter((n) => n.courseId !== courseId));

  return (
    <NotesContext.Provider
      value={{ notes, saveNote, togglePin, markReviewed, deleteNote, deleteNotesByCourse }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);