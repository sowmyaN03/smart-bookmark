# Smart Bookmark App

This repository implements the Smart Bookmark App matching the requirements: Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.

Features
- Sign in with Google (Supabase OAuth)
- Add bookmarks (title + URL)
- Bookmarks are private to each user (RLS)
- Real-time bookmark updates across tabs
- Delete your own bookmarks

Quick setup (local development)

1. Create a Supabase project at https://app.supabase.com and note the Project URL and anon/public key.
2. In Supabase SQL editor run `supabase/init.sql` to create the `bookmarks` table and policies.
3. In project settings -> Authentication -> Providers enable Google and set the Redirect URL to your local dev url (e.g., `http://localhost:3000`).
4. Create a `.env.local` file at the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Install dependencies and run locally:

```powershell
cd "C:\Users\User\Desktop\SmartBookmark"
npm install
npm run dev
```

6. Open `http://localhost:3000` and sign in with Google.

Deployment (Vercel)

- Create a new Vercel project pointing at this repository.
- In Vercel project settings add the same env vars from above (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- In Supabase auth provider settings add your Vercel URL as an allowed redirect.

Notes
- The app uses Supabase Realtime (via channels) to push inserts/deletes to connected clients.
- Keep your Supabase anon key private (set it in Vercel env vars, not in source).

If you'd like, I can:
- Run a build check here
- Add TypeScript and tests
- Prepare a Vercel deployment draft
