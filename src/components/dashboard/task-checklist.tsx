"use client";

import { ExternalLink, Lock } from "lucide-react";
import { phaseLabels } from "@/lib/catalog";
import { daysUntil } from "@/lib/date";
import type { TaskPhase, TaskStatus, UserTask } from "@/lib/types";
import { formatRemaining, SelectInput, urgencyClass } from "./shared";

const phases: TaskPhase[] = ["first_14_days", "first_month", "first_90_days", "ongoing"];

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  done: "Done",
  skipped: "Skipped",
};

export function TaskChecklist({
  tasks,
  completedTasks,
  onUpdateTask,
}: {
  tasks: UserTask[];
  completedTasks: number;
  onUpdateTask: (id: string, patch: Partial<{ status: TaskStatus; notes: string }>) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Life admin checklist</h2>
          <p className="mt-1 text-sm text-slate-600">
            Generated from your profile and useful beyond arrival.
          </p>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {completedTasks} complete
        </span>
      </div>

      <div className="mt-4 space-y-5">
        {phases.map((phase) => {
          const phaseTasks = tasks.filter((task) => task.phase === phase);
          if (phaseTasks.length === 0) return null;

          return (
            <div key={phase}>
              <h3 className="text-sm font-semibold text-slate-700">{phaseLabels[phase]}</h3>
              <div className="mt-2 grid gap-2">
                {phaseTasks.map((task) => (
                  <article key={task.id} className="rounded-lg border border-slate-200 bg-white p-3">
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
                          onChange={(value) => onUpdateTask(task.id, { status: value as TaskStatus })}
                          options={Object.entries(statusLabels)}
                        />
                        <textarea
                          value={task.notes}
                          onChange={(event) => onUpdateTask(task.id, { notes: event.target.value })}
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
  );
}
