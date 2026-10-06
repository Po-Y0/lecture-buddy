import { createContext, useContext, useEffect, useState } from "react";
import { apiDelete, apiGet, apiPatch, apiPost } from "../api/client";
import { useAuth } from "./AuthContext";

const CoursesContext = createContext(null);

export function CoursesProvider({ children }) {
  const { user, initializing: authInitializing } = useAuth();
  const [data, setData] = useState({ ownerId: null, courses: [], sources: [] });
  const [requestError, setRequestError] = useState(null);
  const ownerId = user?.id ?? null;
  const isCurrentData = data.ownerId === ownerId;
  const courses = isCurrentData ? data.courses : [];
  const sources = isCurrentData ? data.sources : [];
  const error = requestError?.ownerId === ownerId ? requestError.message : "";
  const loading =
    authInitializing ||
    (Boolean(user) && !isCurrentData && requestError?.ownerId !== ownerId);

  useEffect(() => {
    if (authInitializing || !user) return undefined;
    let active = true;
    Promise.all([apiGet("/courses"), apiGet("/sources")])
      .then(([courseList, sourceList]) => {
        if (!active) return;
        setData({ ownerId: user.id, courses: courseList, sources: sourceList });
        setRequestError(null);
      })
      .catch((apiError) => {
        if (active) setRequestError({ ownerId: user.id, message: apiError.message });
      });
    return () => {
      active = false;
    };
  }, [user, authInitializing]);

  const saveCourse = async (courseData) => {
    setRequestError(null);
    try {
      const { id, ...body } = courseData;
      const saved = id
        ? await apiPatch(`/courses/${encodeURIComponent(id)}`, body)
        : await apiPost("/courses", body);
      setData((previous) => {
        const oldCourses = previous.ownerId === user.id ? previous.courses : [];
        return {
          ownerId: user.id,
          courses: id
            ? oldCourses.map((course) => (course.id === saved.id ? saved : course))
            : [...oldCourses, saved],
          sources: previous.ownerId === user.id ? previous.sources : [],
        };
      });
      return saved;
    } catch (apiError) {
      setRequestError({ ownerId: user.id, message: apiError.message });
      throw apiError;
    }
  };

  const deleteCourse = async (id) => {
    setRequestError(null);
    try {
      await apiDelete(`/courses/${encodeURIComponent(id)}`);
      setData((previous) => ({
        ownerId: user.id,
        courses:
          previous.ownerId === user.id
            ? previous.courses.filter((course) => course.id !== id)
            : [],
        sources:
          previous.ownerId === user.id
            ? previous.sources.filter((source) => source.courseId !== id)
            : [],
      }));
    } catch (apiError) {
      setRequestError({ ownerId: user.id, message: apiError.message });
      throw apiError;
    }
  };

  const addSources = async (courseId, files) => {
    setRequestError(null);
    const uploaded = [];
    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        uploaded.push(
          await apiPost(`/courses/${encodeURIComponent(courseId)}/sources`, body)
        );
      }
      setData((previous) => ({
        ownerId: user.id,
        courses: previous.ownerId === user.id ? previous.courses : [],
        sources:
          previous.ownerId === user.id
            ? [...previous.sources, ...uploaded]
            : uploaded,
      }));
      return uploaded;
    } catch (apiError) {
      if (uploaded.length) {
        setData((previous) => ({
          ownerId: user.id,
          courses: previous.ownerId === user.id ? previous.courses : [],
          sources:
            previous.ownerId === user.id
              ? [...previous.sources, ...uploaded]
              : uploaded,
        }));
      }
      const message = uploaded.length
        ? `${uploaded.length} file(s) uploaded. ${apiError.message}`
        : apiError.message;
      setRequestError({ ownerId: user.id, message });
      const partialUploadError = new Error(message);
      partialUploadError.uploadedCount = uploaded.length;
      throw partialUploadError;
    }
  };

  const removeSource = async (id) => {
    setRequestError(null);
    try {
      await apiDelete(`/sources/${encodeURIComponent(id)}`);
      setData((previous) => ({
        ownerId: user.id,
        courses: previous.ownerId === user.id ? previous.courses : [],
        sources:
          previous.ownerId === user.id
            ? previous.sources.filter((source) => source.id !== id)
            : [],
      }));
    } catch (apiError) {
      setRequestError({ ownerId: user.id, message: apiError.message });
      throw apiError;
    }
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        sources,
        loading,
        error,
        saveCourse,
        deleteCourse,
        addSources,
        removeSource,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export const useCourses = () => useContext(CoursesContext);
