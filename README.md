# Japan Foreigner Survival

A local-first Next.js service MVP for new foreign residents during their first 90 days in Japan.

The app helps users organize:

- arrival profile and first setup status
- generated city-office, banking, phone, insurance, pension, housing, and renewal tasks
- residence-card and custom deadlines
- document checklists and official-source guide links
- local JSON export/import backups

The current product works without an account. Supabase-ready API routes and schema are included for the next cloud-sync step.

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The API routes expect a user bearer token from Supabase Auth:

- `GET/PUT /api/profile`
- `GET/POST/PATCH /api/tasks`
- `GET/POST/PATCH /api/deadlines`
- `GET /api/export`

The UI remains local-first until authentication and cloud sync are wired into the client.

## Privacy Boundary

Do not store passport images, residence-card images, or full My Number values in v1. Store task status, due dates, and notes only.
