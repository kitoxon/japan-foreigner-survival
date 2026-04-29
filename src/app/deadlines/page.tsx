"use client";

import { useState } from "react";
import { DeadlinesSection } from "@/components/dashboard/deadlines-section";
import { useJapanReady } from "@/components/japan-ready-provider";

export default function DeadlinesPage() {
  const { state, addDeadline, updateDeadline } = useJapanReady();
  const [newDeadline, setNewDeadline] = useState({ label: "", date: "" });

  return (
    <DeadlinesSection
      deadlines={state.deadlines}
      newDeadline={newDeadline}
      onNewDeadlineChange={setNewDeadline}
      onAddDeadline={() => {
        addDeadline(newDeadline);
        setNewDeadline({ label: "", date: "" });
      }}
      onUpdateDeadline={updateDeadline}
    />
  );
}
