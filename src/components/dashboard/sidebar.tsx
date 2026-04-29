"use client";

import { Download, RefreshCw, ShieldCheck, Upload, WalletCards } from "lucide-react";
import type { ChangeEvent } from "react";
import type { MoveInCostBreakdown } from "@/lib/money";
import type { SetupStatus, UserProfile } from "@/lib/types";
import { formatYen, SelectInput, TextInput } from "./shared";

const setupLabels: Record<SetupStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

export function ArrivalProfileCard({
  profile,
  onboardingComplete,
  onProfileChange,
  onGenerate,
}: {
  profile: UserProfile;
  onboardingComplete: boolean;
  onProfileChange: (patch: Partial<UserProfile>) => void;
  onGenerate: () => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Arrival profile</h2>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {onboardingComplete ? "Ready" : "Draft"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <TextInput
          label="Name"
          value={profile.residentName}
          placeholder="Your name"
          onChange={(value) => onProfileChange({ residentName: value })}
        />
        <TextInput
          label="Arrival date"
          type="date"
          value={profile.arrivalDate}
          onChange={(value) => onProfileChange({ arrivalDate: value })}
        />
        <TextInput
          label="Visa / status"
          value={profile.visaStatus}
          placeholder="Engineer, Student, Dependent..."
          onChange={(value) => onProfileChange({ visaStatus: value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            label="Prefecture"
            value={profile.prefecture}
            placeholder="Tokyo"
            onChange={(value) => onProfileChange({ prefecture: value })}
          />
          <TextInput
            label="City / ward"
            value={profile.city}
            placeholder="Shibuya"
            onChange={(value) => onProfileChange({ city: value })}
          />
        </div>

        <SelectInput
          label="Housing"
          value={profile.housingStatus}
          onChange={(value) =>
            onProfileChange({ housingStatus: value as UserProfile["housingStatus"] })
          }
          options={[
            ["temporary", "Temporary"],
            ["fixed", "Fixed address"],
            ["searching", "Still searching"],
          ]}
        />
        <SelectInput
          label="Phone"
          value={profile.phoneStatus}
          onChange={(value) => onProfileChange({ phoneStatus: value as SetupStatus })}
          options={Object.entries(setupLabels)}
        />
        <SelectInput
          label="Bank"
          value={profile.bankStatus}
          onChange={(value) => onProfileChange({ bankStatus: value as SetupStatus })}
          options={Object.entries(setupLabels)}
        />
        <SelectInput
          label="Insurance"
          value={profile.insuranceStatus}
          onChange={(value) => onProfileChange({ insuranceStatus: value as SetupStatus })}
          options={Object.entries(setupLabels)}
        />

        <button
          onClick={onGenerate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
        >
          <RefreshCw size={16} />
          Generate checklist
        </button>
      </div>
    </section>
  );
}

export function SafetyCard() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-teal-700" />
        <h2 className="font-semibold">Safety boundary</h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        This app stores task status, notes, and dates. Do not save passport images,
        residence-card images, or full My Number values.
      </p>
    </section>
  );
}

export function BackupCard({
  importError,
  onDownload,
  onImport,
}: {
  importError: string;
  onDownload: () => void;
  onImport: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold">Backup</h2>
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
          Local free
        </span>
      </div>
      <div className="mt-4 grid gap-2">
        <button
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <Download size={16} />
          Save backup
        </button>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50">
          <Upload size={16} />
          <span className="font-semibold">Load backup</span>
          <input className="hidden" type="file" accept="application/json" onChange={onImport} />
        </label>
        <p className="text-xs leading-5 text-slate-500">
          Use this if you switch browsers or want a copy of your data.
        </p>
        {importError ? <p className="text-sm text-rose-700">{importError}</p> : null}
      </div>
    </section>
  );
}

export function MoneySummaryCard({ costs }: { costs: MoveInCostBreakdown }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <WalletCards size={18} className="text-teal-700" />
        <h2 className="font-semibold">Move-in estimate</h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Quick estimate of cash needed before keys. Edit the detailed calculator on the right.
      </p>
      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase text-slate-500">Estimated cash before keys</p>
        <p className="mt-1 text-2xl font-semibold">{formatYen(costs.upfrontTotal)}</p>
        <p className="mt-1 text-xs text-slate-500">
          About {costs.upfrontMonths.toFixed(1)} months of housing cost.
        </p>
      </div>
    </section>
  );
}
