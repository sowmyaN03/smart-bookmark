Smart Bookmark App

A real-time bookmark manager built with modern web technologies — Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.
Users can sign in with Google, add and delete bookmarks, and see updates instantly across multiple browser tabs.

This project was developed as a fullstack micro-challenge submission and demonstrates core skills in authentication, data modeling, real-time sync, and cloud deployment.

🚀 Live Demo

👉 Live URL: 

)


🔧 Tech Stack
Feature                    |          Technology
----------------------------------------------------------------------
Frontend Framework	       |     Next.js (App Router)
Authentication	           |     Google OAuth via Supabase
Backend	                   |     Supabase (PostgreSQL + Realtime + Auth)
Styling	                   |     Tailwind CSS
Deployment	               |     Vercel
Database Policies	         |     Supabase Row Level Security
Realtime Sync              |   	 Supabase Realtime Channels


✨ Features

🔐 Google Sign-In Only — No email/password; OAuth powered.

⭐ Add Bookmarks — Save a URL + title.

🔒 Private to Each User — One user cannot see another’s data.

🔄 Realtime Updates — Changes appear instantly across tabs without page refresh.

🗑 Delete Bookmarks — Removes only your own bookmarks.

📦 Supabase Row Level Security (RLS) — Ensures data privacy and integrity.

🌐 Deployed to Vercel — Accessible from browser.

📁 Project Structure
smart-bookmark/
├─ app/                  # Next.js routes (App Router)
│  ├─ layout.js          # Root layout
│  └─ page.js            # Main app logic
├─ lib/
│  └─ supabaseClient.js  # Supabase client config
├─ supabase.sql          # Database schema + RLS policies
├─ public/               # Public assets
├─ .env.example          # Environment variable template
├─ package.json          # Project dependencies
└─ next.config.js        # Next.js config

🛠️ Setup & Installation

Clone the repository:

git clone https://github.com/sowmyaN03/smart-bookmark.git
cd smart-bookmark


Install dependencies:

npm install


Copy .env.example to .env.local and add your Supabase keys:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


Run the app locally:

npm run dev

💾 Database Setup (Supabase)

Run this SQL in Supabase SQL editor:

create extension if not exists "uuid-ossp";

create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table bookmarks enable row level security;

create policy "Users can view own bookmarks"
on bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
on bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
on bookmarks for delete using (auth.uid() = user_id);

📌 Enabling Google Auth

In Supabase → Authentication → Providers → Google, enable Google sign-in.

Add your Google OAuth Client ID and Client Secret.

Add your domain to Site URL in Supabase.

Add redirect URL from Supabase into Google Cloud Console.

Example redirect URI:

https://your-supabase-project.supabase.co/auth/v1/callback

📦 Deployment to Vercel

Push to GitHub.

Go to Vercel → Import Project → Select GitHub Repo.

Add Environment Variables:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

Deploy!

🧠 Why This Project Matters

This app showcases:

✔ Real-world authentication flow
✔ Secure database access using RLS
✔ Realtime features across tabs
✔ Clean fullstack architecture
✔ Good UI/UX fundamentals
✔ Cloud deployment pipeline

It’s exactly the sort of practical, polished project real companies look for in candidates.

📝 What I Learned

How to structure Next.js App Router applications

How to integrate Supabase services (Auth, Database, Realtime)

How to enforce strong database security using Row Level Security

How to deploy production apps to Vercel

How to build responsive UI with Tailwind CSS

🔗 Links 

⭐ Project Repository: https://github.com/sowmyaN03/smart-bookmark

🌐 Live Demo: https://smartbookmark-sowmyan03s-projects.vercel.app/

🙌 Thank You

Thank you for visiting this project!
Feel free to reach out if you’d like to see improvements, get help on deployment, or collaborate on future apps.
