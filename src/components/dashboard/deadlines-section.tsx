"use client";

import { Plus } from "lucide-react";
import { daysUntil } from "@/lib/date";
import type { Deadline } from "@/lib/types";
import { formatRemaining, urgencyClass } from "./shared";

export function DeadlinesSection({
  deadlines,
  newDeadline,
  onNewDeadlineChange,
  onAddDeadline,
  onUpdateDeadline,
}: {
  deadlines: Deadline[];
  newDeadline: { label: string; date: string };
  onNewDeadlineChange: (deadline: { label: string; date: string }) => void;
  onAddDeadline: () => void;
  onUpdateDeadline: (id: string, patch: Partial<Deadline>) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Deadlines</h2>
          <p className="mt-1 text-sm text-slate-600">
            Residence card, renewal, moving, and custom dates.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,10rem)_auto]">
          <input
            value={newDeadline.label}
            onChange={(event) =>
              onNewDeadlineChange({ ...newDeadline, label: event.target.value })
            }
            className="min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
            placeholder="New deadline"
          />
          <input
            type="date"
            value={newDeadline.date}
            onChange={(event) =>
              onNewDeadlineChange({ ...newDeadline, date: event.target.value })
            }
            className="min-w-0 rounded-lg border border-slate-300 px-2 py-2 text-xs outline-none focus:border-teal-600 sm:text-[13px]"
          />
          <button
            onClick={onAddDeadline}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {deadlines.map((deadline) => {
          const remaining = daysUntil(deadline.date);
          return (
            <div key={deadline.id} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,10rem)]">
                <input
                  value={deadline.label}
                  onChange={(event) => onUpdateDeadline(deadline.id, { label: event.target.value })}
                  className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                />
                <input
                  type="date"
                  value={deadline.date}
                  onChange={(event) => onUpdateDeadline(deadline.id, { date: event.target.value })}
                  className="min-w-0 rounded-md border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-teal-600 sm:text-[13px]"
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
  );
}
