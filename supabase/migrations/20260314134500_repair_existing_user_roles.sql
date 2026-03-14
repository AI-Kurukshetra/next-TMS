do $$
begin
  if exists (
    select 1
    from pg_enum enum
    join pg_type type on type.oid = enum.enumtypid
    where type.typname = 'user_role'
      and enum.enumlabel = 'carrier_manager'
  ) and not exists (
    select 1
    from pg_enum enum
    join pg_type type on type.oid = enum.enumtypid
    where type.typname = 'user_role'
      and enum.enumlabel = 'customer'
  ) then
    alter type public.user_role rename value 'carrier_manager' to 'customer';
  end if;

  if not exists (
    select 1
    from pg_enum enum
    join pg_type type on type.oid = enum.enumtypid
    where type.typname = 'user_role'
      and enum.enumlabel = 'customer'
  ) then
    alter type public.user_role add value 'customer';
  end if;
end
$$;

alter table public.users
alter column role set default 'customer';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role;
begin
  requested_role := case coalesce(new.raw_user_meta_data ->> 'role', '')
    when 'admin' then 'admin'
    when 'dispatcher' then 'dispatcher'
    when 'driver' then 'driver'
    when 'customer' then 'customer'
    else 'customer'
  end;

  insert into public.users (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    requested_role
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role;

  return new;
end;
$$;

update public.users
set role = case coalesce(auth_users.raw_user_meta_data ->> 'role', '')
  when 'admin' then 'admin'::public.user_role
  when 'dispatcher' then 'dispatcher'::public.user_role
  when 'driver' then 'driver'::public.user_role
  when 'customer' then 'customer'::public.user_role
  else public.users.role
end
from auth.users as auth_users
where auth_users.id = public.users.id;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
