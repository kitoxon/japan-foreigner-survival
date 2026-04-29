"use client";

import { AlertTriangle, ExternalLink, TimerReset } from "lucide-react";
import { mistakeAlerts, survivalTimelines } from "@/lib/survival-content";

export function MistakeAlerts() {
  return (
    <section className="rounded-lg border border-rose-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} className="text-rose-700" />
        <h2 className="font-semibold">Expensive mistake alerts</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        The checklist is useful, but these are the things that can quietly cost real money.
      </p>

      <div className="mt-4 grid gap-2 lg:grid-cols-2">
        {mistakeAlerts.map((alert) => (
          <article key={alert.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{alert.title}</h3>
              <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                {alert.severity}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{alert.body}</p>
            <a
              href={alert.sourceUrl}
              target={alert.sourceUrl.startsWith("#") ? undefined : "_blank"}
              rel={alert.sourceUrl.startsWith("#") ? undefined : "noreferrer"}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              {alert.sourceLabel}
              <ExternalLink size={13} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TimelineSection() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <TimerReset size={18} className="text-teal-700" />
        <h2 className="font-semibold">Life moment timelines</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        People do not experience Japan paperwork as one checklist. They hit it during specific moments.
      </p>

      <div className="mt-4 grid gap-2 lg:grid-cols-4">
        {survivalTimelines.map((timeline) => (
          <article key={timeline.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <h3 className="font-semibold">{timeline.title}</h3>
            <p className="mt-1 text-xs font-medium uppercase text-slate-500">{timeline.focus}</p>
            <ul className="mt-3 space-y-2 text-sm leading-5 text-slate-600">
              {timeline.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
