"use client";

import { useState } from "react";
import { NotesGuidesSection } from "@/components/dashboard/notes-guides";
import { useJapanReady } from "@/components/japan-ready-provider";

export default function NotesPage() {
  const { state, addNote, updateNote, deleteNote } = useJapanReady();
  const [newNote, setNewNote] = useState({ title: "", body: "" });

  return (
    <NotesGuidesSection
      notes={state.notes}
      newNote={newNote}
      onNewNoteChange={setNewNote}
      onAddNote={() => {
        addNote(newNote);
        setNewNote({ title: "", body: "" });
      }}
      onUpdateNote={updateNote}
      onDeleteNote={deleteNote}
    />
  );
}
