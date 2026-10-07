-- 냉큼 10인 파일럿용 Supabase 스키마 (RA 2명 + 학생 8명 권장)
-- Supabase Dashboard > SQL Editor > New query에서 전체를 실행하세요.

create table if not exists public.pilot_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  room text not null default '',
  member_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pilot_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.pilot_members enable row level security;
alter table public.pilot_state enable row level security;

drop policy if exists "pilot members can read roster" on public.pilot_members;
drop policy if exists "pilot member can read own profile" on public.pilot_members;
create policy "pilot member can read own profile"
on public.pilot_members for select to authenticated using (auth.uid() = user_id);

drop policy if exists "pilot member can insert own profile" on public.pilot_members;
create policy "pilot member can insert own profile"
on public.pilot_members for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "pilot member can update own profile" on public.pilot_members;
create policy "pilot member can update own profile"
on public.pilot_members for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "pilot participants can read shared state" on public.pilot_state;
create policy "pilot participants can read shared state"
on public.pilot_state for select to authenticated using (true);

drop policy if exists "pilot participants can create shared state" on public.pilot_state;
create policy "pilot participants can create shared state"
on public.pilot_state for insert to authenticated with check (true);

drop policy if exists "pilot participants can update shared state" on public.pilot_state;
create policy "pilot participants can update shared state"
on public.pilot_state for update to authenticated using (true) with check (true);

grant select, insert, update on public.pilot_members to authenticated;
grant select, insert, update on public.pilot_state to authenticated;

-- RA가 저장한 냉장고 이름·구조를 다른 학생 기기에 즉시 전달합니다.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pilot_state'
  ) then
    alter publication supabase_realtime add table public.pilot_state;
  end if;
end $$;
