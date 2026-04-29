create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  resident_name text not null default '',
  arrival_date date not null,
  visa_status text not null default '',
  prefecture text not null default '',
  city text not null default '',
  language_preference text not null default 'en',
  housing_status text not null default 'temporary',
  phone_status text not null default 'not_started',
  bank_status text not null default 'not_started',
  insurance_status text not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_tasks (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  template_id text not null,
  phase text not null,
  title text not null,
  category text not null,
  explanation text not null,
  required_documents text[] not null default '{}',
  expected_office text not null default '',
  source_label text not null default '',
  source_url text not null default '',
  due_date date,
  status text not null default 'todo',
  notes text not null default '',
  premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.deadlines (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  label text not null,
  date date,
  type text not null default 'custom',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.task_templates (
  id text primary key,
  phase text not null,
  title text not null,
  category text not null,
  due_offset_days integer,
  explanation text not null,
  required_documents text[] not null default '{}',
  expected_office text not null,
  source_label text not null,
  source_url text not null,
  premium boolean not null default false,
  last_reviewed date not null default current_date
);

create table if not exists public.guide_articles (
  id text primary key,
  title text not null,
  category text not null,
  summary text not null,
  source_label text not null,
  source_url text not null,
  last_reviewed date not null
);

alter table public.user_profiles enable row level security;
alter table public.user_tasks enable row level security;
alter table public.deadlines enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can upsert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read own tasks"
  on public.user_tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on public.user_tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.user_tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can read own deadlines"
  on public.deadlines for select
  using (auth.uid() = user_id);

create policy "Users can insert own deadlines"
  on public.deadlines for insert
  with check (auth.uid() = user_id);

create policy "Users can update own deadlines"
  on public.deadlines for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
