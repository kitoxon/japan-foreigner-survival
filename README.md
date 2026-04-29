# Japan Foreigner Survival

A local-first Next.js service MVP for new foreign residents during their first 90 days in Japan.

The app helps users organize:

- arrival profile and first setup status
- generated city-office, banking, phone, insurance, pension, housing, and renewal tasks
- residence-card and custom deadlines
- document checklists and official-source guide links
- move-in cost estimates, rent affordability checks, and rental fee glossary
- local JSON export/import backups

The current product works without an account. Supabase-ready API routes and schema are included for the next cloud-sync step.

## PWA

The app includes installable PWA metadata:

- `src/app/manifest.ts` for the web app manifest.
- Generated app icons in `src/app/icon.tsx`, `src/app/apple-icon.tsx`, and PNG route handlers.
- `public/sw.js` for a conservative offline shell cache.
- `src/components/pwa-registration.tsx` to register the service worker in production.

Installability should be tested after deployment over HTTPS, for example on Vercel.

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

## Future Statistics Data

For salary, wage, housing, and city comparisons, use sourced statistics instead of hard-coded claims:

- Statistics Dashboard API: no registration required and supports JSON/CSV.
- e-Stat API: official government statistics API; requires signup and an application ID.
- Japan Post postal-code/digital-address API: official free API announced for postal-code and digital-address lookup, useful for address autofill.
- Digital Agency address base registry: official base address/location data that can support future address normalization.

Real-time apartment listings are not included in those official APIs, so the current move-in calculator uses user-entered listing numbers.

## Privacy Boundary

Do not store passport images, residence-card images, or full My Number values in v1. Store task status, due dates, and notes only.
