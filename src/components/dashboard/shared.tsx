"use client";

import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { daysUntil } from "@/lib/date";

export function urgencyClass(days: number | null) {
  if (days === null) return "border-slate-200 bg-slate-50 text-slate-500";
  if (days < 0) return "border-rose-200 bg-rose-50 text-rose-700";
  if (days <= 14) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export function formatRemaining(date: string | null) {
  if (!date) return "No date";
  const remaining = daysUntil(date);
  if (remaining === null) return "No date";
  if (remaining < 0) return `${Math.abs(remaining)} days late`;
  if (remaining === 0) return "Due today";
  return `${remaining} days`;
}

export function formatYen(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate text-base font-semibold">{value}</p>
    </div>
  );
}

export function TextInput({
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

export function NumberInput({
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
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={draft}
        onBlur={() => {
          if (draft === "") {
            setDraft("0");
            onChange(0);
          }
        }}
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          if (raw === "") return;
          const parsed = Number(raw);
          if (!Number.isNaN(parsed)) onChange(parsed);
        }}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
      />
    </label>
  );
}

export function SelectInput({
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

export function LockedFeature({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
      {icon}
      {label}
      <Lock size={14} className="text-slate-400" />
    </div>
  );
}
