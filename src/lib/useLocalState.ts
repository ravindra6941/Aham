"use client";

import { useState, useEffect, useCallback } from "react";

// Generic localStorage hook with SSR safety
export function useLocalState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, [key]);

  const set = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {}
        return resolved;
      });
    },
    [key]
  );

  return [value, set, loaded] as const;
}

// === Domain-specific hooks ===

export interface KoshaProgress {
  annamaya: number;
  pranamaya: number;
  manomaya: number;
  vijnanamaya: number;
  anandamaya: number;
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  koshaLevel: string;
  isBrahmaMuhurta: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "rishi";
  content: string;
  timestamp: string;
}

export interface UserState {
  assignedRishi: string;
  onboarded: boolean;
  firstAnswer: string;
  koshaProgress: KoshaProgress;
  journal: JournalEntry[];
  chatHistory: ChatMessage[];
  totalSessions: number;
  lastVisit: string;
}

const DEFAULT_USER_STATE: UserState = {
  assignedRishi: "",
  onboarded: false,
  firstAnswer: "",
  koshaProgress: {
    annamaya: 0,
    pranamaya: 0,
    manomaya: 0,
    vijnanamaya: 0,
    anandamaya: 0,
  },
  journal: [],
  chatHistory: [],
  totalSessions: 0,
  lastVisit: "",
};

export function useUserState() {
  const [state, setState, loaded] = useLocalState<UserState>("aham_user", DEFAULT_USER_STATE);

  const updateKosha = useCallback(
    (kosha: keyof KoshaProgress, increment: number) => {
      setState((prev) => ({
        ...prev,
        koshaProgress: {
          ...prev.koshaProgress,
          [kosha]: Math.min(100, prev.koshaProgress[kosha] + increment),
        },
      }));
    },
    [setState]
  );

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id" | "timestamp">) => {
      setState((prev) => ({
        ...prev,
        journal: [
          ...prev.journal,
          {
            ...entry,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    },
    [setState]
  );

  const addChatMessage = useCallback(
    (msg: Omit<ChatMessage, "id" | "timestamp">) => {
      setState((prev) => ({
        ...prev,
        chatHistory: [
          ...prev.chatHistory,
          {
            ...msg,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    },
    [setState]
  );

  const setRishi = useCallback(
    (rishi: string) => {
      setState((prev) => ({ ...prev, assignedRishi: rishi }));
    },
    [setState]
  );

  return {
    state,
    loaded,
    setState,
    updateKosha,
    addJournalEntry,
    addChatMessage,
    setRishi,
  };
}
