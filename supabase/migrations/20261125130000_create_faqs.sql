create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 300),
  answer text not null check (char_length(answer) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

drop policy if exists "FAQs are publicly readable" on public.faqs;
create policy "FAQs are publicly readable"
  on public.faqs
  for select
  to anon, authenticated
  using (true);

grant select on public.faqs to anon, authenticated;
grant all on public.faqs to service_role;
