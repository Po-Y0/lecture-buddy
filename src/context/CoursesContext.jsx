import { createContext, useContext, useEffect, useState } from "react";

const CoursesContext = createContext(null);

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState(() => load("courses", []));
  const [sources, setSources] = useState(() => load("sources", []));

  useEffect(() => localStorage.setItem("courses", JSON.stringify(courses)), [courses]);
  useEffect(() => localStorage.setItem("sources", JSON.stringify(sources)), [sources]);

  // มี id = แก้ไข, ไม่มี id = เพิ่มใหม่
  const saveCourse = (data) =>
    setCourses((prev) =>
      data.id
        ? prev.map((c) => (c.id === data.id ? { ...c, ...data } : c))
        : [...prev, { ...data, id: crypto.randomUUID() }]
    );

  const deleteCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setSources((prev) => prev.filter((s) => s.courseId !== id));
  };

  const addSources = (courseId, files) =>
    setSources((prev) => [
      ...prev,
      ...files.map((f) => ({
        id: crypto.randomUUID(),
        courseId,
        name: f.name,
        size: f.size,
        type: f.type,
        addedAt: Date.now(),
      })),
    ]);

  const removeSource = (id) => setSources((prev) => prev.filter((s) => s.id !== id));

  return (
    <CoursesContext.Provider
      value={{ courses, sources, saveCourse, deleteCourse, addSources, removeSource }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export const useCourses = () => useContext(CoursesContext);