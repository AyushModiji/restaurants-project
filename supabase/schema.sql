create extension if not exists pgcrypto;
create table if not exists public.site_drafts(id integer primary key check(id=1),content jsonb not null default '{}'::jsonb,updated_at timestamptz default now());
create table if not exists public.published_site_content(id integer primary key check(id=1),content jsonb not null default '{}'::jsonb,updated_at timestamptz default now());
insert into public.site_drafts(id,content) values(1,'{}') on conflict(id) do nothing;
insert into public.published_site_content(id,content) values(1,'{}') on conflict(id) do nothing;
create table if not exists public.menu_items(id uuid primary key default gen_random_uuid(),name text not null,description text not null default '',price text not null default '',category text not null default 'Menu',image_url text not null default '',is_available boolean not null default true,sort_order int not null default 100,created_at timestamptz default now());
alter table public.site_drafts enable row level security;alter table public.published_site_content enable row level security;alter table public.menu_items enable row level security;
create policy "public read published content" on public.published_site_content for select to anon,authenticated using(true);
create policy "public read available menu" on public.menu_items for select to anon,authenticated using(is_available=true);
create policy "admin read drafts" on public.site_drafts for select to authenticated using((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null);
create policy "admin insert drafts" on public.site_drafts for insert to authenticated with check((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null);
create policy "admin update drafts" on public.site_drafts for update to authenticated using((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null) with check((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null);
create policy "admin insert published" on public.published_site_content for insert to authenticated with check((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null);
create policy "admin update published" on public.published_site_content for update to authenticated using((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null) with check((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null);
create policy "admin insert menu" on public.menu_items for insert to authenticated with check((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null);
create policy "admin update menu" on public.menu_items for update to authenticated using((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null) with check((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null);
create policy "admin delete menu" on public.menu_items for delete to authenticated using((auth.jwt()->'app_metadata'->>'role')='admin' and auth.jwt()->>'email_confirmed_at' is not null);
-- Configure app_metadata.role='admin' for the owner using trusted server-side Supabase admin tooling.
-- Never expose a Supabase service-role key in browser code.
