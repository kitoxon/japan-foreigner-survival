import { describe, expect, it } from "vitest";
import { defaultProfile } from "./app-state";
import { generateTasks, mergeGeneratedTasks } from "./task-generation";
import type { UserTask } from "./types";

describe("task generation", () => {
  it("builds a first-90-days checklist from onboarding answers", () => {
    const profile = defaultProfile(new Date(2026, 3, 24));
    const tasks = generateTasks(profile);

    expect(tasks.some((task) => task.templateId === "address-registration")).toBe(true);
    expect(tasks.find((task) => task.templateId === "address-registration")?.dueDate).toBe(
      "2026-05-08",
    );
    expect(tasks.some((task) => task.phase === "ongoing")).toBe(true);
  });

  it("skips address registration when the user is still searching for housing", () => {
    const profile = { ...defaultProfile(), housingStatus: "searching" as const };

    expect(generateTasks(profile).some((task) => task.templateId === "address-registration")).toBe(
      false,
    );
  });

  it("preserves user task status and notes when regenerating", () => {
    const profile = defaultProfile(new Date(2026, 3, 24));
    const generated = generateTasks(profile);
    const current: UserTask[] = [
      {
        ...generated[0],
        status: "done",
        notes: "Went to ward office.",
      },
    ];

    const merged = mergeGeneratedTasks(current, generated);

    expect(merged[0].status).toBe("done");
    expect(merged[0].notes).toBe("Went to ward office.");
  });
});
