create extension if not exists pgcrypto;

create table if not exists public.school_settings (
  id uuid primary key default gen_random_uuid(),
  school_name text not null default 'Dynamiek Rijschool',
  school_timezone text not null default 'Europe/Amsterdam',
  instructors text[] not null default array['Youssef', 'Noah', 'Lisa'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'student')),
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_single_owner_idx on public.profiles (role) where role = 'owner';

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'Actief' check (status in ('Actief', 'Gepauzeerd', 'Afgerond')),
  full_name text not null default '',
  address text not null default '',
  city text not null default '',
  postal_code text not null default '',
  date_of_birth date,
  phone text not null default '',
  email text not null default '',
  cbr_number text not null default '',
  theory_certificate_number text not null default '',
  health_declaration_status text not null default 'In behandeling' check (health_declaration_status in ('Ingediend', 'Goedgekeurd', 'Ontbreekt', 'In behandeling')),
  license_category text not null default 'B' check (license_category in ('B', 'BE', 'A', 'AM')),
  training_start_date date,
  internal_note text,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create table if not exists public.package_infos (
  student_id uuid primary key references public.students(id) on delete cascade,
  package_name text not null default 'Startpakket',
  total_minutes integer not null default 1200,
  used_minutes integer not null default 0,
  extra_minutes integer not null default 0,
  open_balance numeric(10,2) not null default 0,
  next_installment_date date
);

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  instructor text not null,
  car text not null,
  location text not null
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  duration_minutes integer not null,
  pickup_location text not null,
  dropoff_location text not null,
  instructor text not null,
  car text not null,
  lesson_type text not null check (lesson_type in ('Praktijkles', 'Toetsles', 'Examentraining')),
  status text not null check (status in ('Gepland', 'Bevestigd', 'Voltooid', 'Geannuleerd', 'Wachtlijst')),
  notes text,
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  type text not null check (type in ('ID', 'Theoriecertificaat')),
  file_name text,
  uploaded_at timestamptz,
  status text not null check (status in ('idle', 'uploading', 'uploaded', 'rejected', 'replace')),
  rejection_reason text
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  invoice_number text not null,
  period text not null,
  amount numeric(10,2) not null,
  due_date date not null,
  status text not null check (status in ('Betaald', 'Openstaand', 'Verlopen', 'In behandeling')),
  download_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.progress_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  skill text not null,
  level text not null check (level in ('Beginner', 'Voldoende', 'Goed', 'Examenklaar')),
  trend text not null check (trend in ('stijgend', 'stabiel', 'dalend')),
  updated_at timestamptz not null default now(),
  note text not null default ''
);

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  requirement text not null,
  status text not null check (status in ('Voltooid', 'In behandeling', 'Blokkerend')),
  blocker text,
  advice text
);

create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject text not null,
  type text not null check (type in ('Algemeen', 'Planning', 'Betaling', 'Voortgang', 'Systeem')),
  priority text not null check (priority in ('Normaal', 'Belangrijk')),
  unread_count integer not null default 0,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender text not null check (sender in ('Leerling', 'Rijschool')),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false,
  kind text not null check (kind in ('Algemeen', 'Planning', 'Betaling', 'Voortgang', 'Systeem'))
);

create table if not exists public.reminder_settings (
  student_id uuid primary key references public.students(id) on delete cascade,
  email boolean not null default true,
  sms boolean not null default false,
  push boolean not null default true,
  calendar_sync boolean not null default false
);

create table if not exists public.booking_preferences (
  student_id uuid primary key references public.students(id) on delete cascade,
  preferred_time_windows text[] not null default array['Doordeweeks 18:00-21:00'],
  preferred_location text not null default '',
  preferred_instructor text,
  waitlist_enabled boolean not null default true
);

create table if not exists public.calendar_sync_state (
  id boolean primary key default true,
  connected boolean not null default false,
  last_sync_at timestamptz,
  status text not null default 'Niet gekoppeld' check (status in ('Actief', 'Niet gekoppeld', 'Storing')),
  pending_items integer not null default 0,
  external_calendar_name text not null default 'Google Agenda'
);

create table if not exists public.school_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  created_at timestamptz not null default now()
);

create table if not exists public.sync_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  entity text not null check (entity in ('lesson', 'invoice', 'progress', 'document', 'calendar', 'profile')),
  action text not null check (action in ('create', 'update', 'delete')),
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  product_id text not null,
  label text not null,
  amount numeric(10,2) not null,
  payment_method text not null check (payment_method in ('iDEAL', 'Kaart')),
  status text not null check (status in ('pending', 'succeeded', 'failed')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.bump_version()
returns trigger
language plpgsql
as $$
begin
  new.version = coalesce(old.version, 0) + 1;
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_school_settings_updated_at before update on public.school_settings for each row execute function public.set_updated_at();
create trigger set_lessons_updated_at before update on public.lessons for each row execute function public.set_updated_at();
create trigger set_students_updated_at before update on public.students for each row execute function public.set_updated_at();
create trigger bump_students_version before update on public.students for each row execute function public.bump_version();

create or replace function public.current_student_id()
returns uuid
language sql
stable
as $$
  select s.id
  from public.students s
  where s.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'owner'
  );
$$;

create or replace function public.bootstrap_student_data()
returns trigger
language plpgsql
as $$
begin
  insert into public.package_infos (student_id) values (new.id)
    on conflict (student_id) do nothing;

  insert into public.reminder_settings (student_id) values (new.id)
    on conflict (student_id) do nothing;

  insert into public.booking_preferences (student_id, preferred_location)
  values (new.id, coalesce(new.city, ''))
  on conflict (student_id) do nothing;

  insert into public.documents (student_id, type, status)
  values
    (new.id, 'ID', 'idle'),
    (new.id, 'Theoriecertificaat', 'idle')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_student_created after insert on public.students for each row execute function public.bootstrap_student_data();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role text;
  next_name text;
begin
  next_role := case when coalesce(new.raw_user_meta_data->>'role', '') = 'owner' then 'owner' else 'student' end;
  next_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1), 'Nieuwe gebruiker');

  insert into public.profiles (id, role, full_name, email, phone)
  values (new.id, next_role, next_name, coalesce(new.email, ''), coalesce(new.phone, ''))
  on conflict (id) do update
    set role = excluded.role,
        full_name = excluded.full_name,
        email = excluded.email,
        phone = excluded.phone;

  if next_role = 'student' then
    insert into public.students (
      user_id,
      status,
      full_name,
      city,
      email,
      phone,
      training_start_date
    )
    values (
      new.id,
      'Actief',
      next_name,
      '',
      coalesce(new.email, ''),
      coalesce(new.phone, ''),
      current_date
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

insert into public.school_settings (id, school_name, school_timezone, instructors)
values (gen_random_uuid(), 'Dynamiek Rijschool', 'Europe/Amsterdam', array['Youssef', 'Noah', 'Lisa'])
on conflict do nothing;

insert into public.calendar_sync_state (id, connected, status, pending_items, external_calendar_name)
values (true, false, 'Niet gekoppeld', 0, 'Google Agenda')
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.package_infos enable row level security;
alter table public.availability_slots enable row level security;
alter table public.lessons enable row level security;
alter table public.documents enable row level security;
alter table public.invoices enable row level security;
alter table public.progress_items enable row level security;
alter table public.checklist_items enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reminder_settings enable row level security;
alter table public.booking_preferences enable row level security;
alter table public.calendar_sync_state enable row level security;
alter table public.school_alerts enable row level security;
alter table public.sync_events enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.school_settings enable row level security;

create policy "profiles_self_or_owner_select" on public.profiles
for select using (id = auth.uid() or public.is_owner());
create policy "profiles_self_update" on public.profiles
for update using (id = auth.uid() or public.is_owner());

create policy "students_student_or_owner_select" on public.students
for select using (user_id = auth.uid() or public.is_owner());
create policy "students_student_or_owner_update" on public.students
for update using (user_id = auth.uid() or public.is_owner());

create policy "package_infos_student_or_owner" on public.package_infos
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "availability_student_or_owner" on public.availability_slots
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "lessons_student_or_owner" on public.lessons
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "documents_student_or_owner" on public.documents
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "invoices_student_or_owner" on public.invoices
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "progress_student_or_owner" on public.progress_items
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "checklist_student_or_owner" on public.checklist_items
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "message_threads_student_or_owner" on public.message_threads
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "messages_student_or_owner" on public.messages
for all using (
  exists (
    select 1
    from public.message_threads t
    where t.id = messages.thread_id
      and (t.student_id = public.current_student_id() or public.is_owner())
  )
)
with check (
  exists (
    select 1
    from public.message_threads t
    where t.id = messages.thread_id
      and (t.student_id = public.current_student_id() or public.is_owner())
  )
);

create policy "notifications_student_or_owner" on public.notifications
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "reminders_student_or_owner" on public.reminder_settings
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "booking_pref_student_or_owner" on public.booking_preferences
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "calendar_owner_select_student_read" on public.calendar_sync_state
for select using (public.is_owner() or auth.uid() is not null);
create policy "calendar_owner_write" on public.calendar_sync_state
for all using (public.is_owner())
with check (public.is_owner());

create policy "alerts_student_read_owner_all" on public.school_alerts
for select using (auth.uid() is not null or public.is_owner());
create policy "alerts_owner_write" on public.school_alerts
for all using (public.is_owner())
with check (public.is_owner());

create policy "sync_event_student_or_owner_select" on public.sync_events
for select using (
  public.is_owner()
  or student_id is null
  or student_id = public.current_student_id()
);
create policy "sync_event_owner_write" on public.sync_events
for all using (public.is_owner())
with check (public.is_owner());

create policy "payments_student_or_owner" on public.payment_attempts
for all using (student_id = public.current_student_id() or public.is_owner())
with check (student_id = public.current_student_id() or public.is_owner());

create policy "school_settings_authenticated_read" on public.school_settings
for select using (auth.uid() is not null or public.is_owner());
create policy "school_settings_owner_write" on public.school_settings
for all using (public.is_owner())
with check (public.is_owner());
