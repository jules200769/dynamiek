-- Seed baseline records for existing student users.
-- Run after migration to bootstrap realistic portal data.

insert into public.school_alerts (title, description, severity)
values
  ('Facturatie check', '2 facturen staan op bijna vervaldatum.', 'warning'),
  ('Kalendersync actief', 'Alle agenda items zijn succesvol gesynchroniseerd.', 'info')
on conflict do nothing;

insert into public.availability_slots (student_id, start_at, end_at, instructor, car, location)
select
  s.id,
  now() + interval '2 day',
  now() + interval '2 day 1 hour 30 minute',
  'Youssef',
  'Volkswagen Polo',
  'CS Utrecht Jaarbeurszijde'
from public.students s
where not exists (
  select 1 from public.availability_slots a where a.student_id = s.id
);

insert into public.lessons (
  student_id,
  start_at,
  end_at,
  duration_minutes,
  pickup_location,
  dropoff_location,
  instructor,
  car,
  lesson_type,
  status,
  notes
)
select
  s.id,
  now() + interval '1 day',
  now() + interval '1 day 1 hour 30 minute',
  90,
  'CS Utrecht Jaarbeurszijde',
  'CS Utrecht Jaarbeurszijde',
  'Youssef',
  'Volkswagen Polo',
  'Praktijkles',
  'Gepland',
  'Eerste ingeplande les via seed'
from public.students s
where not exists (
  select 1 from public.lessons l where l.student_id = s.id
);

insert into public.invoices (student_id, invoice_number, period, amount, due_date, status)
select
  s.id,
  'INV-' || to_char(now(), 'YYYYMM') || '-' || substr(s.id::text, 1, 6),
  to_char(now(), 'Mon YYYY'),
  125.00,
  current_date + 14,
  'Openstaand'
from public.students s
where not exists (
  select 1 from public.invoices i where i.student_id = s.id
);

-- Voortgang en checklist: niet seeden; owner voegt competenties toe via owner-portaal.

insert into public.message_threads (student_id, subject, type, priority, unread_count, pinned)
select
  s.id,
  'Welkom bij Dynamiek',
  'Algemeen',
  'Normaal',
  0,
  true
from public.students s
where not exists (
  select 1 from public.message_threads t where t.student_id = s.id
);

insert into public.messages (thread_id, sender, body)
select
  t.id,
  'Rijschool',
  'Welkom in je portaal. Plan hier eenvoudig je eerstvolgende rijles.'
from public.message_threads t
where not exists (
  select 1 from public.messages m where m.thread_id = t.id
);

insert into public.notifications (student_id, title, body, kind, read)
select
  s.id,
  'Welkom',
  'Je account staat klaar. Controleer je profiel en plan je volgende les.',
  'Algemeen',
  false
from public.students s
where not exists (
  select 1 from public.notifications n where n.student_id = s.id
);
