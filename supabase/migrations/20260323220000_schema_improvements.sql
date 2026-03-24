-- Schema improvements migration
-- Addresses: unique constraints, indexes, singleton enforcement, missing columns
-- Idempotent: veilig als objecten al bestonden (remote drift / eerdere gedeeltelijke runs)

-- 1. Singleton enforcement for school_settings (max 1 row)
create or replace function enforce_school_settings_singleton()
returns trigger as $$
begin
  if (select count(*) from public.school_settings) >= 1 then
    raise exception 'Only one school_settings row is allowed';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists school_settings_singleton on public.school_settings;
create trigger school_settings_singleton
  before insert on public.school_settings
  for each row execute function enforce_school_settings_singleton();

-- 2. Unique constraint on invoice_number
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'invoices_invoice_number_unique'
  ) then
    alter table public.invoices
      add constraint invoices_invoice_number_unique unique (invoice_number);
  end if;
end $$;

-- 3. Unique constraint on documents (student_id, type) for ON CONFLICT to work
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'documents_student_type_unique'
  ) then
    alter table public.documents
      add constraint documents_student_type_unique unique (student_id, type);
  end if;
end $$;

-- 4. Add created_at to students table
alter table public.students
  add column if not exists created_at timestamptz not null default now();

-- 5. Indexes on frequently queried foreign keys
create index if not exists idx_lessons_student_id on public.lessons (student_id);
create index if not exists idx_invoices_student_id on public.invoices (student_id);
create index if not exists idx_notifications_student_id on public.notifications (student_id);
create index if not exists idx_progress_items_student_id on public.progress_items (student_id);
create index if not exists idx_checklist_items_student_id on public.checklist_items (student_id);
create index if not exists idx_message_threads_student_id on public.message_threads (student_id);
create index if not exists idx_availability_slots_student_id on public.availability_slots (student_id);
create index if not exists idx_documents_student_id on public.documents (student_id);
create index if not exists idx_payment_attempts_student_id on public.payment_attempts (student_id);
create index if not exists idx_sync_events_student_id on public.sync_events (student_id);

-- 6. Lessons index on start_at for ordering queries
create index if not exists idx_lessons_start_at on public.lessons (start_at);

-- 7. Consistency check: duration_minutes matches start/end
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'lessons_duration_check'
  ) then
    alter table public.lessons
      add constraint lessons_duration_check
      check (duration_minutes = extract(epoch from (end_at - start_at))::integer / 60);
  end if;
end $$;
