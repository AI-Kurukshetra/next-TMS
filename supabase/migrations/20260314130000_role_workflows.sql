alter type public.tracking_event_type add value if not exists 'reached_destination';

alter table public.users
add column if not exists customer_id uuid references public.customers(id) on delete set null;
