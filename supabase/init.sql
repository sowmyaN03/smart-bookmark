-- Supabase initialization SQL for Smart Bookmark App
-- Run this in the Supabase SQL editor or via psql for your project

create extension if not exists pgcrypto;

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  inserted_at timestamptz default now()
);

alter table bookmarks enable row level security;

-- Allow authenticated users to select their own rows
create policy select_own on bookmarks
  for select using (auth.uid() = user_id);

create policy insert_own on bookmarks
  for insert with check (auth.uid() = user_id);

create policy delete_own on bookmarks
  for delete using (auth.uid() = user_id);

-- Performance: index on user_id for faster queries by owner
create index if not exists bookmarks_user_id_idx on bookmarks (user_id);
