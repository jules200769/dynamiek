-- RLS helper functions must bypass row security when they read the same tables
-- that policies are evaluated for; otherwise PostgreSQL can hit infinite recursion
-- or internal errors (HTTP 500 from PostgREST) when policies call is_owner().

create or replace function public.current_student_id()
returns uuid
language sql
stable
security definer
set search_path = public
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
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'owner'
  );
$$;

grant execute on function public.current_student_id() to anon, authenticated, service_role;
grant execute on function public.is_owner() to anon, authenticated, service_role;
