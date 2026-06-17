# Supabase setup — live cursors

The canvas **"N exploring now"** pill and live visitor cursors use Supabase **Realtime** (presence + broadcast). No database tables are required.

If the env vars below are missing, the canvas runs exactly as before (no cursors, no pill). Nothing crashes.

## 1. Create a project

1. Go to <https://supabase.com> → **New project** (free tier is plenty).
2. Once it's ready, open **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key

## 2. Add env vars

Add these to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

Restart `pnpm dev` after adding them.

> The anon key is safe to expose in the browser — that's its purpose. Presence and broadcast channels are open by design for this feature.

## 3. Done

Run the app, open it in two browser windows, and you should see:

- a green **"N exploring now"** pill bottom-left,
- each window's cursor in the other (labelled with a random Spidey-verse name).

Realtime **presence/broadcast** needs no extra database config — it works as soon as the env vars are set.

## Cost

Realtime presence sits comfortably inside Supabase's free tier for a personal portfolio. Watch **Realtime concurrent connections** if you ever get a big traffic spike.
