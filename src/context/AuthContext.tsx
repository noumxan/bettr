"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Role = "student" | "admin";

export interface AuthUser {
  username: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  logout: () => void;
  isAdmin: boolean;
}

const STORAGE_KEY = "bettr-auth";

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as AuthUser;
    if (data?.username && (data.role === "student" || data.role === "admin")) return data;
  } catch {}
  return null;
}

function saveStored(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(loadStored());
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error ?? "Login failed" };
      }
      const authUser: AuthUser = {
        username: data.user?.username ?? username,
        role: data.user?.role ?? data.role ?? "student",
      };
      setUser(authUser);
      saveStored(authUser);
      return { ok: true, user: authUser };
    } catch (e) {
      return { ok: false, error: "Network error" };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveStored(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
