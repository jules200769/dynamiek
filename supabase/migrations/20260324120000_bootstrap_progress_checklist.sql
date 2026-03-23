-- Seed default progress + checklist for new students (bootstrap) and backfill existing rows.

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

  insert into public.progress_items (student_id, skill, level, trend, note)
  values (
    new.id,
    'Kijktechniek',
    'Voldoende',
    'stijgend',
    'Goede ontwikkeling op scan- en spiegeltechniek.'
  );

  insert into public.checklist_items (student_id, requirement, status, advice)
  values (
    new.id,
    'Theoriecertificaat geverifieerd',
    'In behandeling',
    'Upload certificaat in portaal om af te ronden.'
  );

  return new;
end;
$$;

insert into public.progress_items (student_id, skill, level, trend, note)
select
  s.id,
  'Kijktechniek',
  'Voldoende',
  'stijgend',
  'Goede ontwikkeling op scan- en spiegeltechniek.'
from public.students s
where not exists (
  select 1 from public.progress_items p where p.student_id = s.id
);

insert into public.checklist_items (student_id, requirement, status, advice)
select
  s.id,
  'Theoriecertificaat geverifieerd',
  'In behandeling',
  'Upload certificaat in portaal om af te ronden.'
from public.students s
where not exists (
  select 1 from public.checklist_items c where c.student_id = s.id
);
