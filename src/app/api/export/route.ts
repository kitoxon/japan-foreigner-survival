import { getSupabaseRouteContext, mapSupabaseError } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const [profileResult, tasksResult, deadlinesResult] = await Promise.all([
    context.client.from("user_profiles").select("*").eq("user_id", context.userId).maybeSingle(),
    context.client.from("user_tasks").select("*").eq("user_id", context.userId),
    context.client.from("deadlines").select("*").eq("user_id", context.userId),
  ]);

  const errorResponse =
    mapSupabaseError(profileResult.error) ??
    mapSupabaseError(tasksResult.error) ??
    mapSupabaseError(deadlinesResult.error);
  if (errorResponse) return errorResponse;

  return Response.json({
    version: 2,
    exportedAt: new Date().toISOString(),
    profile: profileResult.data,
    tasks: tasksResult.data ?? [],
    deadlines: deadlinesResult.data ?? [],
    privacyNote:
      "Exports should not contain passport, residence-card images, or full My Number values.",
  });
}
