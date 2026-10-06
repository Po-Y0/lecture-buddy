import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/client";

const AuthContext = createContext(null);

function clearLegacyCredentials() {
  try {
    localStorage.removeItem("users");
    localStorage.removeItem("user");
    return "";
  } catch (storageError) {
    return `Could not clear legacy local credentials: ${storageError.message}`;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("lecture-buddy:unauthorized", handleUnauthorized);
    apiGet("/auth/me")
      .then((currentUser) => {
        if (active) {
          setUser(currentUser);
          const cleanupError = clearLegacyCredentials();
          if (cleanupError) setError(cleanupError);
        }
      })
      .catch((requestError) => {
        if (active) {
          if (requestError.status === 401) {
            const cleanupError = clearLegacyCredentials();
            if (cleanupError) setError(cleanupError);
          } else {
            setError(requestError.message);
          }
        }
      })
      .finally(() => {
        if (active) setInitializing(false);
      });
    return () => {
      active = false;
      window.removeEventListener("lecture-buddy:unauthorized", handleUnauthorized);
    };
  }, []);

  const register = async (name, email, password) => {
    setBusy(true);
    setError("");
    try {
      await apiPost("/auth/register", { name, email, password });
      return { ok: true };
    } catch (requestError) {
      setError(requestError.message);
      return { ok: false, error: requestError.message };
    } finally {
      setBusy(false);
    }
  };

  const login = async (email, password) => {
    setBusy(true);
    setError("");
    try {
      const authenticatedUser = await apiPost("/auth/login", { email, password });
      setUser(authenticatedUser);
      const cleanupError = clearLegacyCredentials();
      if (cleanupError) setError(cleanupError);
      return { ok: true };
    } catch (requestError) {
      setError(requestError.message);
      return { ok: false, error: requestError.message };
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    setError("");
    try {
      await apiPost("/auth/logout");
      setUser(null);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, initializing, busy, error, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
