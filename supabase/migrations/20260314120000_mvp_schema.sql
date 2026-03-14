create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'dispatcher', 'customer', 'driver');
create type public.shipment_status as enum ('draft', 'booked', 'assigned', 'in_transit', 'delivered', 'cancelled');
create type public.vehicle_status as enum ('available', 'in_use', 'maintenance');
create type public.tracking_event_type as enum (
  'created',
  'assigned',
  'picked_up',
  'in_transit',
  'arrived_hub',
  'out_for_delivery',
  'delivered',
  'exception'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

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
  on conflict (id) do nothing;

  return new;
end;
$$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  billing_address text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.carriers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  mc_number text,
  dot_number text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.user_role not null default 'customer',
  carrier_id uuid references public.carriers(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  full_name text not null,
  phone text,
  license_number text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  driver_id uuid references public.drivers(id) on delete set null,
  vehicle_number text not null unique,
  vehicle_type text,
  capacity_kg numeric(12,2),
  status public.vehicle_status not null default 'available',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  origin_city text not null,
  destination_city text not null,
  distance_km numeric(10,2),
  estimated_hours numeric(10,2),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rates (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references public.carriers(id) on delete set null,
  route_id uuid not null references public.routes(id) on delete cascade,
  vehicle_type text,
  base_rate numeric(12,2) not null,
  rate_per_km numeric(12,2),
  currency text not null default 'INR',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  shipment_number text not null unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  carrier_id uuid references public.carriers(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  route_id uuid references public.routes(id) on delete set null,
  rate_id uuid references public.rates(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  origin_location text not null,
  destination_location text not null,
  pickup_date date,
  delivery_date date,
  weight_kg numeric(12,2),
  status public.shipment_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  event_type public.tracking_event_type not null,
  location text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  created_by uuid references public.users(id) on delete set null
);

create index if not exists idx_shipments_customer_id on public.shipments(customer_id);
create index if not exists idx_shipments_carrier_id on public.shipments(carrier_id);
create index if not exists idx_shipments_status on public.shipments(status);
create index if not exists idx_drivers_carrier_id on public.drivers(carrier_id);
create index if not exists idx_vehicles_carrier_id on public.vehicles(carrier_id);
create index if not exists idx_tracking_events_shipment_id on public.tracking_events(shipment_id);

drop trigger if exists set_shipments_updated_at on public.shipments;
create trigger set_shipments_updated_at
before update on public.shipments
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.users disable row level security;
alter table public.customers disable row level security;
alter table public.carriers disable row level security;
alter table public.drivers disable row level security;
alter table public.vehicles disable row level security;
alter table public.routes disable row level security;
alter table public.rates disable row level security;
alter table public.shipments disable row level security;
alter table public.tracking_events disable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

alter default privileges in schema public
grant select, insert, update, delete on tables to anon, authenticated, service_role;

alter default privileges in schema public
grant usage, select on sequences to anon, authenticated, service_role;

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'shipments'
    ) then
      alter publication supabase_realtime add table public.shipments;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'tracking_events'
    ) then
      alter publication supabase_realtime add table public.tracking_events;
    end if;
  end if;
end
$$;
