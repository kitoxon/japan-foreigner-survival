"use client";

import { CalendarClock, Cloud } from "lucide-react";
import { LockedFeature } from "./shared";

export function StatusCard() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Saved on this device</h2>
          <p className="mt-1 text-sm text-slate-600">
            Your organizer works without an account. Sign-in sync and reminder emails are
            planned paid features.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <LockedFeature icon={<Cloud size={16} />} label="Cloud sync" />
          <LockedFeature icon={<CalendarClock size={16} />} label="Email reminders" />
        </div>
      </div>
    </section>
  );
}
