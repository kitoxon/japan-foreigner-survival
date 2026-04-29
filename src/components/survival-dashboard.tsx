"use client";

import {
  AlertTriangle,
  Calculator,
  CalendarClock,
  Cloud,
  Download,
  ExternalLink,
  FileText,
  Home,
  Lock,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Upload,
  WalletCards,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { guideArticles, phaseLabels } from "@/lib/catalog";
import {
  createDefaultState,
  defaultDeadlines,
  serializeExport,
  STORAGE_KEY,
  validateImportedState,
} from "@/lib/app-state";
import { daysUntil } from "@/lib/date";
import { calculateMoveInCosts, moneyDataSources, rentalGlossary } from "@/lib/money";
import { generateTasks, mergeGeneratedTasks } from "@/lib/task-generation";
import type {
  AppState,
  Deadline,
  PersonalNote,
  MoneyCheck,
  SetupStatus,
  TaskPhase,
  TaskStatus,
  UserProfile,
} from "@/lib/types";

const phases: TaskPhase[] = ["first_14_days", "first_month", "first_90_days", "ongoing"];

const setupLabels: Record<SetupStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  done: "Done",
  skipped: "Skipped",
};

function urgencyClass(days: number | null) {
  if (days === null) return "border-slate-200 bg-slate-50 text-slate-500";
  if (days < 0) return "border-rose-200 bg-rose-50 text-rose-700";
  if (days <= 14) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function formatRemaining(date: string | null) {
  if (!date) return "No date";
  const remaining = daysUntil(date);
  if (remaining === null) return "No date";
  if (remaining < 0) return `${Math.abs(remaining)} days late`;
  if (remaining === 0) return "Due today";
  return `${remaining} days`;
}

function formatYen(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function downloadBackup(state: AppState) {
  const blob = new Blob([serializeExport(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "japan-foreigner-survival-export.json";
  link.click();
  URL.revokeObjectURL(url);
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

  const completedTasks = useMemo(
    () => state.tasks.filter((task) => task.status === "done").length,
    [state.tasks],
  );

  const activeTasks = useMemo(
    () => state.tasks.filter((task) => !task.premium || state.plan === "plus"),
    [state.plan, state.tasks],
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
      deadlines:
        current.deadlines.length > 0 ? current.deadlines : defaultDeadlines(profile),
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
          id: `deadline-${Date.now()}`,
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
          id: `note-${Date.now()}`,
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
      setState(validateImportedState(JSON.parse(await file.text())));
      setImportError("");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Import failed.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
      <header className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Japan resident admin</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Japan Life Admin
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Move in, stay organized, and keep important Japan paperwork and deadlines under control.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm sm:min-w-[440px]">
          <Metric label="Tasks" value={`${completedTasks}/${activeTasks.length}`} />
          <Metric label="Next due" value={nextDeadline ? formatRemaining(nextDeadline.date) : "Set dates"} />
          <Metric label="Move-in cash" value={formatYen(moveInCosts.upfrontTotal)} />
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Arrival profile</h2>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                {state.onboardingComplete ? "Ready" : "Draft"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <TextInput
                label="Name"
                value={state.profile.residentName}
                placeholder="Your name"
                onChange={(value) => updateProfile({ residentName: value })}
              />
              <TextInput
                label="Arrival date"
                type="date"
                value={state.profile.arrivalDate}
                onChange={(value) => updateProfile({ arrivalDate: value })}
              />
              <TextInput
                label="Visa / status"
                value={state.profile.visaStatus}
                placeholder="Engineer, Student, Dependent..."
                onChange={(value) => updateProfile({ visaStatus: value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <TextInput
                  label="Prefecture"
                  value={state.profile.prefecture}
                  placeholder="Tokyo"
                  onChange={(value) => updateProfile({ prefecture: value })}
                />
                <TextInput
                  label="City / ward"
                  value={state.profile.city}
                  placeholder="Shibuya"
                  onChange={(value) => updateProfile({ city: value })}
                />
              </div>

              <SelectInput
                label="Housing"
                value={state.profile.housingStatus}
                onChange={(value) => updateProfile({ housingStatus: value as UserProfile["housingStatus"] })}
                options={[
                  ["temporary", "Temporary"],
                  ["fixed", "Fixed address"],
                  ["searching", "Still searching"],
                ]}
              />
              <SelectInput
                label="Phone"
                value={state.profile.phoneStatus}
                onChange={(value) => updateProfile({ phoneStatus: value as SetupStatus })}
                options={Object.entries(setupLabels)}
              />
              <SelectInput
                label="Bank"
                value={state.profile.bankStatus}
                onChange={(value) => updateProfile({ bankStatus: value as SetupStatus })}
                options={Object.entries(setupLabels)}
              />
              <SelectInput
                label="Insurance"
                value={state.profile.insuranceStatus}
                onChange={(value) => updateProfile({ insuranceStatus: value as SetupStatus })}
                options={Object.entries(setupLabels)}
              />

              <button
                onClick={() => saveProfile(state.profile)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
              >
                <RefreshCw size={16} />
                Generate checklist
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-teal-700" />
              <h2 className="font-semibold">Safety boundary</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This app stores task status, notes, and dates. Do not save passport images, residence-card images, or full My Number values.
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Backup</h2>
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                Local free
              </span>
            </div>
            <div className="mt-4 grid gap-2">
              <button
                onClick={() => downloadBackup(state)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <Download size={16} />
                Download backup
              </button>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                <Upload size={16} />
                Restore backup
                <input className="hidden" type="file" accept="application/json" onChange={importFile} />
              </label>
              <p className="text-xs leading-5 text-slate-500">
                Use this if you switch browsers or want a copy of your data.
              </p>
              {importError ? <p className="text-sm text-rose-700">{importError}</p> : null}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <WalletCards size={18} className="text-teal-700" />
              <h2 className="font-semibold">Money reality check</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Estimate cash needed before signing. Use the numbers from the listing or agent; fees vary by property.
            </p>
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Estimated upfront</p>
              <p className="mt-1 text-2xl font-semibold">{formatYen(moveInCosts.upfrontTotal)}</p>
              <p className="mt-1 text-xs text-slate-500">
                About {moveInCosts.upfrontMonths.toFixed(1)} months of housing cost.
              </p>
            </div>
          </section>
        </aside>

        <section className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Saved on this device</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Your organizer works without an account. Sign-in sync and reminder emails are planned paid features.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <LockedFeature icon={<Cloud size={16} />} label="Cloud sync" />
                <LockedFeature icon={<CalendarClock size={16} />} label="Email reminders" />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Calculator size={18} className="text-teal-700" />
                  <h2 className="font-semibold">Move-in cost calculator</h2>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Check key money, guarantor fees, insurance, and whether rent fits your income.
                </p>
              </div>
              <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                Editable estimate
              </span>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <NumberInput
                  label="Monthly rent"
                  value={state.moneyCheck.monthlyRent}
                  onChange={(value) => updateMoneyCheck({ monthlyRent: value })}
                />
                <NumberInput
                  label="Management fee"
                  value={state.moneyCheck.managementFee}
                  onChange={(value) => updateMoneyCheck({ managementFee: value })}
                />
                <NumberInput
                  label="Monthly income"
                  value={state.moneyCheck.monthlyIncome}
                  onChange={(value) => updateMoneyCheck({ monthlyIncome: value })}
                />
                <NumberInput
                  label="Deposit months"
                  value={state.moneyCheck.depositMonths}
                  step="0.5"
                  onChange={(value) => updateMoneyCheck({ depositMonths: value })}
                />
                <NumberInput
                  label="Key money months"
                  value={state.moneyCheck.keyMoneyMonths}
                  step="0.5"
                  onChange={(value) => updateMoneyCheck({ keyMoneyMonths: value })}
                />
                <NumberInput
                  label="Agency fee months"
                  value={state.moneyCheck.agencyFeeMonths}
                  step="0.1"
                  onChange={(value) => updateMoneyCheck({ agencyFeeMonths: value })}
                />
                <NumberInput
                  label="Guarantor fee months"
                  value={state.moneyCheck.guarantorFeeMonths}
                  step="0.1"
                  onChange={(value) => updateMoneyCheck({ guarantorFeeMonths: value })}
                />
                <NumberInput
                  label="Fire insurance"
                  value={state.moneyCheck.insuranceFee}
                  onChange={(value) => updateMoneyCheck({ insuranceFee: value })}
                />
                <NumberInput
                  label="Lock exchange"
                  value={state.moneyCheck.lockExchangeFee}
                  onChange={(value) => updateMoneyCheck({ lockExchangeFee: value })}
                />
                <NumberInput
                  label="Cleaning fee"
                  value={state.moneyCheck.cleaningFee}
                  onChange={(value) => updateMoneyCheck({ cleaningFee: value })}
                />
                <NumberInput
                  label="Other fees"
                  value={state.moneyCheck.otherFee}
                  onChange={(value) => updateMoneyCheck({ otherFee: value })}
                />
                <NumberInput
                  label="Move-in day"
                  value={state.moneyCheck.moveInDay}
                  min="1"
                  max="31"
                  onChange={(value) => updateMoneyCheck({ moveInDay: value })}
                />
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={state.moneyCheck.includeNextMonthRent}
                    onChange={(event) =>
                      updateMoneyCheck({ includeNextMonthRent: event.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  Include next month rent
                </label>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase text-slate-500">Total before move-in</p>
                  <p className="mt-1 text-2xl font-semibold">{formatYen(moveInCosts.upfrontTotal)}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Refundable estimate: {formatYen(moveInCosts.refundableEstimate)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Non-refundable estimate: {formatYen(moveInCosts.nonRefundableEstimate)}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="font-semibold">Affordability</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Monthly housing: {formatYen(moveInCosts.monthlyHousingCost)}
                  </p>
                  <p className="text-sm text-slate-600">
                    Rent-to-income:{" "}
                    {moveInCosts.rentToIncomeRatio === null
                      ? "Add income"
                      : `${Math.round(moveInCosts.rentToIncomeRatio * 100)}%`}
                  </p>
                  <p
                    className={`mt-2 w-fit rounded-md px-2 py-1 text-xs font-semibold ${
                      moveInCosts.affordabilityStatus === "comfortable"
                        ? "bg-emerald-50 text-emerald-700"
                        : moveInCosts.affordabilityStatus === "tight"
                          ? "bg-amber-50 text-amber-700"
                          : moveInCosts.affordabilityStatus === "risky"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {moveInCosts.affordabilityStatus === "comfortable"
                      ? "Looks manageable"
                      : moveInCosts.affordabilityStatus === "tight"
                        ? "Tight budget"
                        : moveInCosts.affordabilityStatus === "risky"
                          ? "Risky rent level"
                          : "Need income"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Home size={18} className="text-teal-700" />
                <h2 className="font-semibold">Rental fee glossary</h2>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {rentalGlossary.map((item) => (
                  <article key={item.term} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="font-semibold">{item.term}</p>
                    <p className="mt-1 text-xs font-medium uppercase text-slate-500">{item.japanese}</p>
                    <p className="mt-2 text-sm leading-5 text-slate-600">{item.meaning}</p>
                    <p className="mt-2 text-sm leading-5 text-slate-700">{item.normalCheck}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold">Salary and city data</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Live salary and rent averages need sourced statistics. These free data sources can be connected later.
              </p>
              <div className="mt-3 space-y-2">
                {moneyDataSources.map((source) => (
                  <a
                    key={source.name}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg border border-slate-200 p-3 hover:border-teal-300 hover:bg-teal-50"
                  >
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                      {source.name}
                      <ExternalLink size={13} />
                    </span>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{source.bestFor}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Deadlines</h2>
                <p className="mt-1 text-sm text-slate-600">Residence card, renewal, moving, and custom dates.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_150px_auto]">
                <input
                  value={newDeadline.label}
                  onChange={(event) => setNewDeadline((current) => ({ ...current, label: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                  placeholder="New deadline"
                />
                <input
                  type="date"
                  value={newDeadline.date}
                  onChange={(event) => setNewDeadline((current) => ({ ...current, date: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                />
                <button
                  onClick={addDeadline}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {state.deadlines.map((deadline) => {
                const remaining = daysUntil(deadline.date);
                return (
                  <div key={deadline.id} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="grid gap-2 sm:grid-cols-[1fr_150px]">
                      <input
                        value={deadline.label}
                        onChange={(event) => updateDeadline(deadline.id, { label: event.target.value })}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                      />
                      <input
                        type="date"
                        value={deadline.date}
                        onChange={(event) => updateDeadline(deadline.id, { date: event.target.value })}
                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                      />
                    </div>
                    <div className={`w-fit rounded-md border px-2 py-1 text-xs font-semibold ${urgencyClass(remaining)}`}>
                      {formatRemaining(deadline.date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Life admin checklist</h2>
                <p className="mt-1 text-sm text-slate-600">Generated from your profile and useful beyond arrival.</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                {completedTasks} complete
              </span>
            </div>

            <div className="mt-4 space-y-5">
              {phases.map((phase) => {
                const phaseTasks = state.tasks.filter((task) => task.phase === phase);
                if (phaseTasks.length === 0) return null;

                return (
                  <div key={phase}>
                    <h3 className="text-sm font-semibold text-slate-700">{phaseLabels[phase]}</h3>
                    <div className="mt-2 grid gap-2">
                      {phaseTasks.map((task) => (
                        <article
                          key={task.id}
                          className={`rounded-lg border p-3 ${
                            task.premium && state.plan !== "plus"
                              ? "border-dashed border-slate-300 bg-slate-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="grid gap-3 lg:grid-cols-[1fr_140px]">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-semibold">{task.title}</h4>
                                {task.premium ? (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white">
                                    <Lock size={12} />
                                    Plus
                                  </span>
                                ) : null}
                                <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${urgencyClass(daysUntil(task.dueDate ?? ""))}`}>
                                  {formatRemaining(task.dueDate)}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{task.explanation}</p>
                              <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                                <div>
                                  <p className="font-medium text-slate-700">Documents</p>
                                  <p className="mt-1 text-slate-600">{task.requiredDocuments.join(", ")}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-700">Office / provider</p>
                                  <p className="mt-1 text-slate-600">{task.expectedOffice}</p>
                                </div>
                              </div>
                              <a
                                href={task.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
                              >
                                {task.sourceLabel}
                                <ExternalLink size={14} />
                              </a>
                            </div>

                            <div className="space-y-2">
                              <SelectInput
                                label="Status"
                                value={task.status}
                                onChange={(value) => updateTask(task.id, { status: value as TaskStatus })}
                                options={Object.entries(statusLabels)}
                              />
                              <textarea
                                value={task.notes}
                                onChange={(event) => updateTask(task.id, { notes: event.target.value })}
                                className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                                placeholder="Notes"
                              />
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">Notes</h2>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {state.notes.length}
                </span>
              </div>
              <div className="mt-3 grid gap-2">
                <input
                  value={newNote.title}
                  onChange={(event) => setNewNote((current) => ({ ...current, title: event.target.value }))}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                  placeholder="Note title"
                />
                <textarea
                  value={newNote.body}
                  onChange={(event) => setNewNote((current) => ({ ...current, body: event.target.value }))}
                  className="min-h-24 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-teal-600"
                  placeholder="Landlord contacts, ward office times, utility account numbers, questions for employer or school..."
                />
                <button
                  onClick={addNote}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Add note
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {state.notes.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                    No notes yet.
                  </p>
                ) : null}

                {state.notes.map((note) => (
                  <article key={note.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start gap-2">
                      <input
                        value={note.title}
                        onChange={(event) => updateNote(note.id, { title: event.target.value })}
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                      />
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="rounded-md p-1 text-slate-500 hover:bg-white hover:text-rose-700"
                        aria-label="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <textarea
                      value={note.body}
                      onChange={(event) => updateNote(note.id, { body: event.target.value })}
                      className="mt-2 min-h-20 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                    />
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-teal-700" />
                <h2 className="font-semibold">Official-source guides</h2>
              </div>
              <div className="mt-3 space-y-3">
                {guideArticles.map((guide) => (
                  <a
                    key={guide.id}
                    href={guide.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg border border-slate-200 p-3 hover:border-teal-300 hover:bg-teal-50"
                  >
                    <p className="text-sm font-semibold">{guide.title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{guide.summary}</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
                      {guide.sourceLabel}
                      <ExternalLink size={12} />
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <p>
                Immigration, tax, health insurance, and pension rules depend on your exact facts. Confirm important decisions with official offices or qualified professionals.
              </p>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate text-base font-semibold">{value}</p>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min = "0",
  max,
  step = "1000",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function LockedFeature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
      {icon}
      {label}
      <Lock size={14} className="text-slate-400" />
    </div>
  );
}
