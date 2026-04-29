import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseRouteContext =
  | { ok: true; client: SupabaseClient; userId: string }
  | { ok: false; response: Response };

export async function getSupabaseRouteContext(request: Request): Promise<SupabaseRouteContext> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      ok: false,
      response: Response.json(
        {
          error:
            "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        },
        { status: 503 },
      ),
    };
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return {
      ok: false,
      response: Response.json({ error: "Missing Authorization bearer token." }, { status: 401 }),
    };
  }

  const client = createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    return {
      ok: false,
      response: Response.json({ error: "Invalid or expired session." }, { status: 401 }),
    };
  }

  return { ok: true, client, userId: data.user.id };
}

export function mapSupabaseError(error: { message: string } | null) {
  if (!error) return null;
  return Response.json({ error: error.message }, { status: 400 });
}
