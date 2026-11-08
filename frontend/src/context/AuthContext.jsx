import { createContext, useContext, useEffect, useState } from "react";
import { clearToken, fetchMe, getToken } from "../api";

const USER_KEY = "vellum_user";
const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(readUser);

  const setUser = (nextUser) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
      clearToken();
    }
  };

  useEffect(() => {
    if (!getToken()) return;
    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
