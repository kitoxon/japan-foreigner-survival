import { getSupabaseRouteContext, mapSupabaseError } from "@/lib/supabase/server";
import type { UserTask } from "@/lib/types";

export async function GET(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const { data, error } = await context.client
    .from("user_tasks")
    .select("*")
    .eq("user_id", context.userId)
    .order("due_date", { ascending: true, nullsFirst: false });

  const errorResponse = mapSupabaseError(error);
  if (errorResponse) return errorResponse;

  return Response.json({ tasks: data ?? [] });
}

export async function POST(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const body = (await request.json()) as { tasks?: Partial<UserTask>[] };
  const tasks = Array.isArray(body.tasks) ? body.tasks : [];
  const records = tasks.map((task) => ({
    user_id: context.userId,
    id: task.id,
    template_id: task.templateId,
    phase: task.phase,
    title: task.title,
    category: task.category,
    explanation: task.explanation,
    required_documents: task.requiredDocuments ?? [],
    expected_office: task.expectedOffice ?? "",
    source_label: task.sourceLabel ?? "",
    source_url: task.sourceUrl ?? "",
    due_date: task.dueDate,
    status: task.status ?? "todo",
    notes: task.notes ?? "",
    premium: Boolean(task.premium),
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await context.client
    .from("user_tasks")
    .upsert(records, { onConflict: "user_id,id" })
    .select("*");

  const errorResponse = mapSupabaseError(error);
  if (errorResponse) return errorResponse;

  return Response.json({ tasks: data ?? [] });
}

export async function PATCH(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const body = (await request.json()) as Partial<UserTask>;
  if (!body.id) {
    return Response.json({ error: "Task id is required." }, { status: 400 });
  }

  const { data, error } = await context.client
    .from("user_tasks")
    .update({
      status: body.status,
      notes: body.notes,
      due_date: body.dueDate,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", context.userId)
    .eq("id", body.id)
    .select("*")
    .single();

  const errorResponse = mapSupabaseError(error);
  if (errorResponse) return errorResponse;

  return Response.json({ task: data });
}
