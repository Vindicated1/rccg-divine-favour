create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  name text check (name is null or char_length(name) <= 100),
  testimony text not null check (char_length(trim(testimony)) between 10 and 5000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists testimonies_approved_created_at_idx
  on public.testimonies (approved, created_at desc);

alter table public.testimonies enable row level security;

grant select, insert on public.testimonies to anon, authenticated;
grant all on public.testimonies to service_role;

create policy "Anyone can read approved testimonies"
  on public.testimonies for select
  to anon, authenticated
  using (approved = true);

create policy "Anyone can submit unapproved testimonies"
  on public.testimonies for insert
  to anon, authenticated
  with check (approved = false);
