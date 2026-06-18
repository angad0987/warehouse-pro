import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role } from "./mock-data";

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string, remember: boolean) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "corewh.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string, remember: boolean) => {
    // Mock login: admin@demo.com -> admin, anything else -> staff
    const role: Role = email.toLowerCase().includes("admin") ? "admin" : "staff";
    const u: AuthUser = {
      email,
      name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "User",
      role,
    };
    setUser(u);
    const store = remember ? localStorage : sessionStorage;
    store.setItem(STORAGE_KEY, JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
