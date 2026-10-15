-- Applied to the Supabase project "teamly" (urevewbhdnvfgcgxbdyc) as migration create_post_runway.
create table public.post_runway (
  id text primary key,
  kind text not null check (kind in ('reel','linkedin')),
  n int, format text, title text not null, folder text not null, media text not null, copy text not null, flag text,
  date date not null, slot text not null, week int not null, len text,
  ig boolean not null default false, tt boolean not null default false, yt boolean not null default false,
  li boolean not null default false, cmt boolean not null default false, rep boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.post_runway enable row level security;
-- The tracker page uses the publishable key: it may read every row and flip tick columns only.
revoke all on public.post_runway from anon, authenticated;
grant select on public.post_runway to anon, authenticated;
grant update (ig, tt, yt, li, cmt, rep, updated_at) on public.post_runway to anon, authenticated;
create policy "tracker can read" on public.post_runway for select to anon, authenticated using (true);
create policy "tracker can tick" on public.post_runway for update to anon, authenticated using (true) with check (true);

-- Migration post_runway_archive_published_and_repack (11 Oct): posts the creator had already published
-- were flagged archived (id prefixed 'pub-', week 0) and the remaining 21 were re-packed from Mon 12 Oct.
alter table public.post_runway add column archived boolean not null default false;
