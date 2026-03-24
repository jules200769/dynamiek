-- Stop auto-inserting demo progress/checklist rows for new students.
-- Voortgang en checklist worden alleen via het owner-portaal toegevoegd.

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

-- Verwijder alleen de oude vaste seed/demo-rijen (herkenbaar aan exacte tekst uit eerdere migrations).
delete from public.progress_items
where skill = 'Kijktechniek'
  and note = 'Goede ontwikkeling op scan- en spiegeltechniek.'
  and level = 'Voldoende'
  and trend = 'stijgend';

delete from public.checklist_items
where requirement = 'Theoriecertificaat geverifieerd'
  and status = 'In behandeling'
  and advice = 'Upload certificaat in portaal om af te ronden.';
