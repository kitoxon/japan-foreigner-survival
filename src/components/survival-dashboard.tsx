"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  createDefaultState,
  defaultDeadlines,
  serializeExport,
  STORAGE_KEY,
  validateImportedState,
} from "@/lib/app-state";
import { daysUntil } from "@/lib/date";
import { calculateMoveInCosts } from "@/lib/money";
import { generateTasks, mergeGeneratedTasks } from "@/lib/task-generation";
import type { AppState, Deadline, MoneyCheck, PersonalNote, TaskStatus, UserProfile } from "@/lib/types";
import { DeadlinesSection } from "./dashboard/deadlines-section";
import { LegalWarning } from "./dashboard/legal-warning";
import { MistakeAlerts, TimelineSection } from "./dashboard/mistakes-timeline";
import { MoneyCalculator, RentalInsights } from "./dashboard/money-section";
import { NotesGuidesSection } from "./dashboard/notes-guides";
import {
  ArrivalProfileCard,
  BackupCard,
  MoneySummaryCard,
  SafetyCard,
} from "./dashboard/sidebar";
import { formatRemaining, formatYen, Metric } from "./dashboard/shared";
import { StatusCard } from "./dashboard/status-card";
import { TaskChecklist } from "./dashboard/task-checklist";

const MAX_BACKUP_BYTES = 1_000_000;

function downloadBackup(state: AppState) {
  const blob = new Blob([serializeExport(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "japan-life-admin-backup.json";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function SurvivalDashboard() {
  const [state, setState] = useState<AppState>(() => createDefaultState());
  const [loaded, setLoaded] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ label: "", date: "" });
  const [newNote, setNewNote] = useState({ title: "", body: "" });
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

  const saveProfile = (profile: UserProfile) => {
    setState((current) => ({
      ...current,
      onboardingComplete: true,
      profile,
      tasks: mergeGeneratedTasks(current.tasks, generateTasks(profile)),
      deadlines: current.deadlines.length > 0 ? current.deadlines : defaultDeadlines(profile),
    }));
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    setState((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
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

  const updateDeadline = (id: string, patch: Partial<Deadline>) => {
    setState((current) => ({
      ...current,
      deadlines: current.deadlines.map((deadline) =>
        deadline.id === id ? { ...deadline, ...patch } : deadline,
      ),
    }));
  };

  const addDeadline = () => {
    const label = newDeadline.label.trim();
    if (!label) return;

    setState((current) => ({
      ...current,
      deadlines: [
        ...current.deadlines,
        {
          id: `deadline-${crypto.randomUUID()}`,
          label,
          date: newDeadline.date,
          type: "custom",
          notes: "",
        },
      ],
    }));
    setNewDeadline({ label: "", date: "" });
  };

  const addNote = () => {
    const title = newNote.title.trim();
    const body = newNote.body.trim();
    if (!title && !body) return;

    setState((current) => ({
      ...current,
      notes: [
        {
          id: `note-${crypto.randomUUID()}`,
          title: title || "Untitled note",
          body,
          createdAt: new Date().toISOString(),
        },
        ...current.notes,
      ],
    }));
    setNewNote({ title: "", body: "" });
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
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <header className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Settle in. Stay ready.</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Japan Ready
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            A survival guide for foreign residents who want to avoid expensive Japan mistakes.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm sm:min-w-[440px]">
          <Metric label="Tasks" value={`${completedTasks}/${activeTasks.length}`} />
          <Metric label="Next due" value={nextDeadline ? formatRemaining(nextDeadline.date) : "Set dates"} />
          <Metric label="Move-in estimate" value={formatYen(moveInCosts.upfrontTotal)} />
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <ArrivalProfileCard
            profile={state.profile}
            onboardingComplete={state.onboardingComplete}
            onProfileChange={updateProfile}
            onGenerate={() => saveProfile(state.profile)}
          />
          <SafetyCard />
          <BackupCard
            importError={importError}
            onDownload={() => downloadBackup(state)}
            onImport={importFile}
          />
          <MoneySummaryCard costs={moveInCosts} />
        </aside>

        <section className="space-y-4">
          <MistakeAlerts />
          <TimelineSection />
          <StatusCard />
          <MoneyCalculator
            id="move-in-calculator"
            moneyCheck={state.moneyCheck}
            costs={moveInCosts}
            onChange={updateMoneyCheck}
          />
          <RentalInsights />
          <DeadlinesSection
            deadlines={state.deadlines}
            newDeadline={newDeadline}
            onNewDeadlineChange={setNewDeadline}
            onAddDeadline={addDeadline}
            onUpdateDeadline={updateDeadline}
          />
          <TaskChecklist
            tasks={activeTasks}
            completedTasks={completedTasks}
            onUpdateTask={updateTask}
          />
          <NotesGuidesSection
            notes={state.notes}
            newNote={newNote}
            onNewNoteChange={setNewNote}
            onAddNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
          />
          <LegalWarning />
        </section>
      </section>
    </div>
  );
}
