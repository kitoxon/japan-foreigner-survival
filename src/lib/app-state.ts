import { addDays, todayIso } from "./date";
import { generateTasks } from "./task-generation";
import { defaultMoneyCheck } from "./money";
import type { AppState, Deadline, PersonalNote, UserProfile } from "./types";

export const STORAGE_KEY = "japan-foreigner-survival-state-v2";

export function defaultProfile(now = new Date()): UserProfile {
  return {
    residentName: "",
    arrivalDate: todayIso(now),
    visaStatus: "Work / student / family status",
    prefecture: "",
    city: "",
    languagePreference: "en",
    housingStatus: "temporary",
    phoneStatus: "not_started",
    bankStatus: "not_started",
    insuranceStatus: "not_started",
  };
}

export function defaultDeadlines(profile: UserProfile): Deadline[] {
  const renewalPrep = addDays(profile.arrivalDate, 300);

  return [
    {
      id: "deadline-residence-card",
      label: "Residence card expiry",
      date: "",
      type: "residence_card",
      notes: "Set the date printed on your residence card.",
    },
    {
      id: "deadline-renewal-prep",
      label: "Start renewal preparation",
      date: renewalPrep ?? "",
      type: "visa_renewal",
      notes: "Adjust this once you know your actual period of stay.",
    },
  ];
}

export function createDefaultState(now = new Date()): AppState {
  const profile = defaultProfile(now);
  return {
    version: 2,
    onboardingComplete: false,
    plan: "free",
    profile,
    tasks: generateTasks(profile),
    deadlines: defaultDeadlines(profile),
    notes: [],
    moneyCheck: defaultMoneyCheck,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateImportedState(value: unknown): AppState {
  if (!isRecord(value) || value.version !== 2 || !isRecord(value.profile)) {
    throw new Error("This file is not a valid Japan Foreigner Survival export.");
  }

  if (!Array.isArray(value.tasks) || !Array.isArray(value.deadlines)) {
    throw new Error("The export is missing tasks or deadlines.");
  }

  const state = value as AppState & { notes?: PersonalNote[] | string };
  const legacyNotes = typeof state.notes === "string" ? state.notes.trim() : "";

  return {
    ...state,
    notes: Array.isArray(state.notes)
      ? state.notes
      : legacyNotes
        ? [
            {
              id: "note-imported",
              title: "Imported note",
              body: legacyNotes,
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
    moneyCheck: isRecord(state.moneyCheck)
      ? { ...defaultMoneyCheck, ...state.moneyCheck }
      : defaultMoneyCheck,
  };
}

export function serializeExport(state: AppState) {
  return JSON.stringify(
    {
      ...state,
      exportedAt: new Date().toISOString(),
      privacyNote:
        "This export should not contain passport, residence-card images, or full My Number values.",
    },
    null,
    2,
  );
}
