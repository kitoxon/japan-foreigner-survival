"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  createDefaultState,
  defaultDeadlines,
  serializeExport,
  STORAGE_KEY,
  validateImportedState,
} from "@/lib/app-state";
import { daysUntil } from "@/lib/date";
import { calculateMoveInCosts, type MoveInCostBreakdown } from "@/lib/money";
import { generateTasks, mergeGeneratedTasks } from "@/lib/task-generation";
import type {
  AppState,
  Deadline,
  MoneyCheck,
  PersonalNote,
  TaskStatus,
  UserTask,
  UserProfile,
} from "@/lib/types";

const MAX_BACKUP_BYTES = 1_000_000;

type JapanReadyContextValue = {
  state: AppState;
  activeTasks: UserTask[];
  completedTasks: number;
  nextDeadline?: Deadline;
  moveInCosts: MoveInCostBreakdown;
  importError: string;
  updateProfile: (patch: Partial<UserProfile>) => void;
  saveProfile: () => void;
  updateMoneyCheck: (patch: Partial<MoneyCheck>) => void;
  updateTask: (id: string, patch: Partial<{ status: TaskStatus; notes: string }>) => void;
  addDeadline: (deadline: { label: string; date: string }) => void;
  updateDeadline: (id: string, patch: Partial<Deadline>) => void;
  addNote: (note: { title: string; body: string }) => void;
  updateNote: (id: string, patch: Partial<PersonalNote>) => void;
  deleteNote: (id: string) => void;
  downloadBackup: () => void;
  importFile: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const JapanReadyContext = createContext<JapanReadyContextValue | null>(null);

export function JapanReadyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createDefaultState());
  const [loaded, setLoaded] = useState(false);
  const [importError, setImportError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(validateImportedState(JSON.parse(raw)));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [loaded, state]);

  const activeTasks = useMemo(
    () => state.tasks.filter((task) => !task.premium || state.plan === "plus"),
    [state.plan, state.tasks],
  );

  const completedTasks = useMemo(
    () => activeTasks.filter((task) => task.status === "done").length,
    [activeTasks],
  );

  const nextDeadline = useMemo(() => {
    return [...state.deadlines]
      .filter((deadline) => deadline.date)
      .sort((a, b) => (daysUntil(a.date) ?? 9999) - (daysUntil(b.date) ?? 9999))[0];
  }, [state.deadlines]);

  const moveInCosts = useMemo(
    () => calculateMoveInCosts(state.moneyCheck),
    [state.moneyCheck],
  );

  const updateProfile = (patch: Partial<UserProfile>) => {
    setState((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
  };

  const saveProfile = () => {
    setState((current) => ({
      ...current,
      onboardingComplete: true,
      tasks: mergeGeneratedTasks(current.tasks, generateTasks(current.profile)),
      deadlines:
        current.deadlines.length > 0 ? current.deadlines : defaultDeadlines(current.profile),
    }));
  };

  const updateMoneyCheck = (patch: Partial<MoneyCheck>) => {
    setState((current) => ({
      ...current,
      moneyCheck: { ...current.moneyCheck, ...patch },
    }));
  };

  const updateTask = (id: string, patch: Partial<{ status: TaskStatus; notes: string }>) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)),
    }));
  };

  const addDeadline = ({ label, date }: { label: string; date: string }) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    setState((current) => ({
      ...current,
      deadlines: [
        ...current.deadlines,
        {
          id: `deadline-${crypto.randomUUID()}`,
          label: trimmedLabel,
          date,
          type: "custom",
          notes: "",
        },
      ],
    }));
  };

  const updateDeadline = (id: string, patch: Partial<Deadline>) => {
    setState((current) => ({
      ...current,
      deadlines: current.deadlines.map((deadline) =>
        deadline.id === id ? { ...deadline, ...patch } : deadline,
      ),
    }));
  };

  const addNote = ({ title, body }: { title: string; body: string }) => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle && !trimmedBody) return;

    setState((current) => ({
      ...current,
      notes: [
        {
          id: `note-${crypto.randomUUID()}`,
          title: trimmedTitle || "Untitled note",
          body: trimmedBody,
          createdAt: new Date().toISOString(),
        },
        ...current.notes,
      ],
    }));
  };

  const updateNote = (id: string, patch: Partial<PersonalNote>) => {
    setState((current) => ({
      ...current,
      notes: current.notes.map((note) => (note.id === id ? { ...note, ...patch } : note)),
    }));
  };

  const deleteNote = (id: string) => {
    setState((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== id),
    }));
  };

  const downloadBackup = () => {
    const blob = new Blob([serializeExport(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "japan-life-admin-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.size > MAX_BACKUP_BYTES) {
        throw new Error("Backup file is too large. Please choose a file under 1 MB.");
      }

      const parsed = JSON.parse(await file.text()) as unknown;
      setState(validateImportedState(parsed));
      setImportError("");
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "That backup could not be restored. Please choose a valid backup file.",
      );
    } finally {
      event.target.value = "";
    }
  };

  return (
    <JapanReadyContext.Provider
      value={{
        state,
        activeTasks,
        completedTasks,
        nextDeadline,
        moveInCosts,
        importError,
        updateProfile,
        saveProfile,
        updateMoneyCheck,
        updateTask,
        addDeadline,
        updateDeadline,
        addNote,
        updateNote,
        deleteNote,
        downloadBackup,
        importFile,
      }}
    >
      {children}
    </JapanReadyContext.Provider>
  );
}

export function useJapanReady() {
  const context = useContext(JapanReadyContext);
  if (!context) {
    throw new Error("useJapanReady must be used inside JapanReadyProvider.");
  }
  return context;
}
