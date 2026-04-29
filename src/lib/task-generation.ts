import { taskTemplates } from "./catalog";
import { dueDateFromArrival } from "./date";
import type { TaskTemplate, UserProfile, UserTask } from "./types";

function includeTemplate(template: TaskTemplate, profile: UserProfile) {
  if (template.id === "address-registration") {
    return profile.housingStatus !== "searching";
  }
  if (template.id === "phone-plan") {
    return profile.phoneStatus !== "done";
  }
  if (template.id === "bank-account") {
    return profile.bankStatus !== "done";
  }
  if (template.id === "health-insurance") {
    return profile.insuranceStatus !== "done";
  }
  return true;
}

export function generateTasks(profile: UserProfile): UserTask[] {
  return taskTemplates
    .filter((template) => includeTemplate(template, profile))
    .map((template) => ({
      id: `task-${template.id}`,
      templateId: template.id,
      phase: template.phase,
      title: template.title,
      category: template.category,
      explanation: template.explanation,
      requiredDocuments: template.requiredDocuments,
      expectedOffice: template.expectedOffice,
      sourceLabel: template.sourceLabel,
      sourceUrl: template.sourceUrl,
      dueDate: dueDateFromArrival(profile.arrivalDate, template.dueOffsetDays),
      status: "todo",
      notes: "",
      premium: template.premium,
    }));
}

export function mergeGeneratedTasks(currentTasks: UserTask[], generatedTasks: UserTask[]) {
  const currentByTemplate = new Map(currentTasks.map((task) => [task.templateId, task]));

  return generatedTasks.map((generated) => {
    const existing = currentByTemplate.get(generated.templateId);
    if (!existing) return generated;
    return {
      ...generated,
      id: existing.id,
      status: existing.status,
      notes: existing.notes,
    };
  });
}
