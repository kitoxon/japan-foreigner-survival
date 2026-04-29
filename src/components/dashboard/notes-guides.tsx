"use client";

import { ExternalLink, FileText, Plus, Trash2 } from "lucide-react";
import { guideArticles } from "@/lib/catalog";
import type { PersonalNote } from "@/lib/types";

export function NotesGuidesSection({
  notes,
  newNote,
  onNewNoteChange,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: {
  notes: PersonalNote[];
  newNote: { title: string; body: string };
  onNewNoteChange: (note: { title: string; body: string }) => void;
  onAddNote: () => void;
  onUpdateNote: (id: string, patch: Partial<PersonalNote>) => void;
  onDeleteNote: (id: string) => void;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Notes</h2>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {notes.length}
          </span>
        </div>
        <div className="mt-3 grid gap-2">
          <input
            value={newNote.title}
            onChange={(event) => onNewNoteChange({ ...newNote, title: event.target.value })}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
            placeholder="Note title"
          />
          <textarea
            value={newNote.body}
            onChange={(event) => onNewNoteChange({ ...newNote, body: event.target.value })}
            className="min-h-24 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-teal-600"
            placeholder="Landlord contacts, ward office times, utility account numbers, questions for employer or school..."
          />
          <button
            onClick={onAddNote}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Add note
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {notes.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
              No notes yet.
            </p>
          ) : null}

          {notes.map((note) => (
            <article key={note.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-2">
                <input
                  value={note.title}
                  onChange={(event) => onUpdateNote(note.id, { title: event.target.value })}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                />
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="rounded-md p-1 text-slate-500 hover:bg-white hover:text-rose-700"
                  aria-label="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                value={note.body}
                onChange={(event) => onUpdateNote(note.id, { body: event.target.value })}
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
  );
}
