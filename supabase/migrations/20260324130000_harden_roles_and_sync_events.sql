-- P0-1: Never trust client-supplied role — always create students via signup.
-- Owner provisioning must happen via Supabase Dashboard or service-role API.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_name text;
begin
  next_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1), 'Nieuwe gebruiker');

  insert into public.profiles (id, role, full_name, email, phone)
  values (new.id, 'student', next_name, coalesce(new.email, ''), coalesce(new.phone, ''))
  on conflict (id) do update
    set full_name = excluded.full_name,
        email    = excluded.email,
        phone    = excluded.phone;

  insert into public.students (
    user_id, status, full_name, city, email, phone, training_start_date
  )
  values (
    new.id, 'Actief', next_name, '', coalesce(new.email, ''), coalesce(new.phone, ''), current_date
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- P0-1b: Prevent students from escalating their own role via profiles UPDATE.
-- The trigger fires BEFORE UPDATE and resets `role` to the old value unless
-- the caller is the owner (checked via the existing is_owner() helper).
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_owner() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_trg on public.profiles;
create trigger protect_profile_role_trg
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- P0-2: Allow students to insert their own sync_events (audit log).
drop policy if exists "sync_event_student_insert" on public.sync_events;
create policy "sync_event_student_insert" on public.sync_events
  for insert
  with check (student_id = public.current_student_id());

-- P3: Enable Supabase Realtime for tables that PortalContext / OwnerPortalContext subscribe to.
-- Idempotent: skip if table is already in the publication.
do $pub$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'students') then
    alter publication supabase_realtime add table public.students;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'package_infos') then
    alter publication supabase_realtime add table public.package_infos;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'lessons') then
    alter publication supabase_realtime add table public.lessons;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'availability_slots') then
    alter publication supabase_realtime add table public.availability_slots;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'documents') then
    alter publication supabase_realtime add table public.documents;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'invoices') then
    alter publication supabase_realtime add table public.invoices;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'progress_items') then
    alter publication supabase_realtime add table public.progress_items;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'checklist_items') then
    alter publication supabase_realtime add table public.checklist_items;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'message_threads') then
    alter publication supabase_realtime add table public.message_threads;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications') then
    alter publication supabase_realtime add table public.notifications;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reminder_settings') then
    alter publication supabase_realtime add table public.reminder_settings;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'booking_preferences') then
    alter publication supabase_realtime add table public.booking_preferences;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'payment_attempts') then
    alter publication supabase_realtime add table public.payment_attempts;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sync_events') then
    alter publication supabase_realtime add table public.sync_events;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'school_settings') then
    alter publication supabase_realtime add table public.school_settings;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'calendar_sync_state') then
    alter publication supabase_realtime add table public.calendar_sync_state;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'school_alerts') then
    alter publication supabase_realtime add table public.school_alerts;
  end if;
end $pub$;
