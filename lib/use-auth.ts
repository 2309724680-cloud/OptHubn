"use client";

import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  name: string;
  email: string;
}

const STORAGE_KEY = "npuhub_user";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const login = useCallback((email: string, password: string): string | null => {
    try {
      const accounts: Record<string, { name: string; password: string }> =
        JSON.parse(localStorage.getItem("npuhub_accounts") ?? "{}");
      const account = accounts[email];
      if (!account) return "账号不存在";
      if (account.password !== password) return "密码错误";
      const u = { name: account.name, email };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
      return null;
    } catch {
      return "登录失败，请重试";
    }
  }, []);

  const register = useCallback((name: string, email: string, password: string): string | null => {
    try {
      const accounts: Record<string, { name: string; password: string }> =
        JSON.parse(localStorage.getItem("npuhub_accounts") ?? "{}");
      if (accounts[email]) return "该邮箱已注册";
      accounts[email] = { name, password };
      localStorage.setItem("npuhub_accounts", JSON.stringify(accounts));
      const u = { name, email };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
      return null;
    } catch {
      return "注册失败，请重试";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, login, register, logout };
}
