import { createContext, useContext, useEffect, useState } from "react";
import { apiDelete, apiGet, apiPatch, apiPost } from "../api/client";
import { useAuth } from "./AuthContext";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const { user, initializing: authInitializing } = useAuth();
  const [data, setData] = useState({ ownerId: null, notes: [] });
  const [requestError, setRequestError] = useState(null);
  const ownerId = user?.id ?? null;
  const isCurrentData = data.ownerId === ownerId;
  const notes = isCurrentData ? data.notes : [];
  const error = requestError?.ownerId === ownerId ? requestError.message : "";
  const loading =
    authInitializing ||
    (Boolean(user) && !isCurrentData && requestError?.ownerId !== ownerId);

  useEffect(() => {
    if (authInitializing || !user) return undefined;
    let active = true;
    apiGet("/notes")
      .then((noteList) => {
        if (!active) return;
        setData({ ownerId: user.id, notes: noteList });
        setRequestError(null);
      })
      .catch((apiError) => {
        if (active) setRequestError({ ownerId: user.id, message: apiError.message });
      });
    return () => {
      active = false;
    };
  }, [user, authInitializing]);

  const saveNote = async (noteData) => {
    setRequestError(null);
    try {
      const body = {
        title: noteData.title,
        content: noteData.content ?? "",
        tags: noteData.tags ?? [],
      };
      const saved = noteData.id
        ? await apiPatch(`/notes/${encodeURIComponent(noteData.id)}`, {
            ...body,
            pinned: noteData.pinned,
            lastReviewedAt: noteData.lastReviewedAt,
          })
        : await apiPost(
            `/courses/${encodeURIComponent(noteData.courseId)}/notes`,
            body
          );
      setData((previous) => {
        const existing = previous.ownerId === user.id ? previous.notes : [];
        return {
          ownerId: user.id,
          notes: noteData.id
            ? existing.map((note) => (note.id === saved.id ? saved : note))
            : [saved, ...existing],
        };
      });
      return saved;
    } catch (apiError) {
      setRequestError({ ownerId: user.id, message: apiError.message });
      throw apiError;
    }
  };

  const togglePin = async (id) => {
    const note = notes.find((entry) => entry.id === id);
    if (!note) return;
    setRequestError(null);
    try {
      const updated = await apiPatch(`/notes/${encodeURIComponent(id)}`, {
        pinned: !note.pinned,
      });
      setData((previous) => ({
        ownerId: user.id,
        notes:
          previous.ownerId === user.id
            ? previous.notes.map((entry) => (entry.id === id ? updated : entry))
            : [],
      }));
    } catch (apiError) {
      setRequestError({ ownerId: user.id, message: apiError.message });
    }
  };

  const markReviewed = async (id) => {
    setRequestError(null);
    try {
      const updated = await apiPatch(`/notes/${encodeURIComponent(id)}`, {
        lastReviewedAt: Date.now(),
      });
      setData((previous) => ({
        ownerId: user.id,
        notes:
          previous.ownerId === user.id
            ? previous.notes.map((entry) => (entry.id === id ? updated : entry))
            : [],
      }));
    } catch (apiError) {
      setRequestError({ ownerId: user.id, message: apiError.message });
    }
  };

  const deleteNote = async (id) => {
    setRequestError(null);
    try {
      await apiDelete(`/notes/${encodeURIComponent(id)}`);
      setData((previous) => ({
        ownerId: user.id,
        notes:
          previous.ownerId === user.id
            ? previous.notes.filter((note) => note.id !== id)
            : [],
      }));
    } catch (apiError) {
      setRequestError({ ownerId: user.id, message: apiError.message });
    }
  };

  const deleteNotesByCourse = (courseId) => {
    setData((previous) => ({
      ownerId,
      notes:
        previous.ownerId === ownerId
          ? previous.notes.filter((note) => note.courseId !== courseId)
          : [],
    }));
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        saveNote,
        togglePin,
        markReviewed,
        deleteNote,
        deleteNotesByCourse,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
