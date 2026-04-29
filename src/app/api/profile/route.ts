import { getSupabaseRouteContext, mapSupabaseError } from "@/lib/supabase/server";
import type { UserProfile } from "@/lib/types";

export async function GET(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const { data, error } = await context.client
    .from("user_profiles")
    .select("*")
    .eq("user_id", context.userId)
    .maybeSingle();

  const errorResponse = mapSupabaseError(error);
  if (errorResponse) return errorResponse;

  return Response.json({ profile: data });
}

export async function PUT(request: Request) {
  const context = await getSupabaseRouteContext(request);
  if (!context.ok) return context.response;

  const body = (await request.json()) as { profile?: Partial<UserProfile> } & Partial<UserProfile>;
  const profile = body.profile ?? body;

  const { data, error } = await context.client
    .from("user_profiles")
    .upsert(
      {
        user_id: context.userId,
        resident_name: profile.residentName ?? "",
        arrival_date: profile.arrivalDate,
        visa_status: profile.visaStatus ?? "",
        prefecture: profile.prefecture ?? "",
        city: profile.city ?? "",
        language_preference: profile.languagePreference ?? "en",
        housing_status: profile.housingStatus ?? "temporary",
        phone_status: profile.phoneStatus ?? "not_started",
        bank_status: profile.bankStatus ?? "not_started",
        insurance_status: profile.insuranceStatus ?? "not_started",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  const errorResponse = mapSupabaseError(error);
  if (errorResponse) return errorResponse;

  return Response.json({ profile: data });
}
