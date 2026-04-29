import { getSupabaseRouteContext, mapSupabaseError } from "@/lib/supabase/server";
import type { Deadline } from "@/lib/types";

export async function GET(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const { data, error } = await context.client
    .from("deadlines")
    .select("*")
    .eq("user_id", context.userId)
    .order("date", { ascending: true, nullsFirst: false });

  const errorResponse = mapSupabaseError(error);
  if (errorResponse) return errorResponse;

  return Response.json({ deadlines: data ?? [] });
}

export async function POST(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const body = (await request.json()) as { deadlines?: Partial<Deadline>[] };
  const deadlines = Array.isArray(body.deadlines) ? body.deadlines : [];
  const records = deadlines.map((deadline) => ({
    user_id: context.userId,
    id: deadline.id,
    label: deadline.label,
    date: deadline.date || null,
    type: deadline.type ?? "custom",
    notes: deadline.notes ?? "",
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await context.client
    .from("deadlines")
    .upsert(records, { onConflict: "user_id,id" })
    .select("*");

  const errorResponse = mapSupabaseError(error);
  if (errorResponse) return errorResponse;

  return Response.json({ deadlines: data ?? [] });
}

export async function PATCH(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const body = (await request.json()) as Partial<Deadline>;
  if (!body.id) {
    return Response.json({ error: "Deadline id is required." }, { status: 400 });
  }

  const { data, error } = await context.client
    .from("deadlines")
    .update({
      label: body.label,
      date: body.date || null,
      type: body.type,
      notes: body.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", context.userId)
    .eq("id", body.id)
    .select("*")
    .single();

  const errorResponse = mapSupabaseError(error);
  if (errorResponse) return errorResponse;

  return Response.json({ deadline: data });
}
