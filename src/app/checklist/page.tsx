"use client";

import { TaskChecklist } from "@/components/dashboard/task-checklist";
import { useJapanReady } from "@/components/japan-ready-provider";

export default function ChecklistPage() {
  const { activeTasks, completedTasks, updateTask } = useJapanReady();

  return (
    <TaskChecklist
      tasks={activeTasks}
      completedTasks={completedTasks}
      onUpdateTask={updateTask}
    />
  );
}
