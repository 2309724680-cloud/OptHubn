"use client";

import { useState, useEffect, useCallback } from "react";

export interface HistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  input: string;
  output: string;
  createdAt: string;
}

const STORAGE_KEY = "opthub_history";
const MAX_ITEMS = 50;

function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addHistory = useCallback((item: Omit<HistoryItem, "id" | "createdAt">) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => {
      const next = [newItem, ...prev].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addHistory, clearHistory };
}
