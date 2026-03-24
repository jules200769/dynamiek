-- Advice shown to the student in the portal (dashboard / progress); editable by owner.
alter table public.students
  add column if not exists instructor_advice text not null default '';

comment on column public.students.instructor_advice is 'Short guidance for the learner; shown in student portal when set.';
