insert into public.customers (id, company_name, contact_name, email, phone, billing_address)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'Acme Retail',
    'Priya Shah',
    'ops@acmeretail.example',
    '+91-9000000001',
    'Ahmedabad, Gujarat'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Metro Wholesale',
    'Rahul Jain',
    'dispatch@metrowholesale.example',
    '+91-9000000002',
    'Mumbai, Maharashtra'
  )
on conflict (id) do nothing;

insert into public.carriers (id, company_name, contact_name, email, phone, mc_number, dot_number)
values
  (
    '20000000-0000-0000-0000-000000000001',
    'BlueLine Logistics',
    'Karan Mehta',
    'ops@blueline.example',
    '+91-9100000001',
    'MC-10101',
    'DOT-10101'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'RoadStar Freight',
    'Nikita Rao',
    'dispatch@roadstar.example',
    '+91-9100000002',
    'MC-20202',
    'DOT-20202'
  )
on conflict (id) do nothing;

insert into public.drivers (id, carrier_id, full_name, phone, license_number)
values
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Arjun Patel',
    '+91-9200000001',
    'DL-AP-1001'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'Sana Khan',
    '+91-9200000002',
    'DL-SK-1002'
  )
on conflict (id) do nothing;

insert into public.vehicles (id, carrier_id, driver_id, vehicle_number, vehicle_type, capacity_kg, status)
values
  (
    '40000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'GJ-01-TRK-1024',
    'Truck',
    12000,
    'available'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    'MH-04-CAR-7788',
    'Trailer',
    18000,
    'available'
  )
on conflict (id) do nothing;

insert into public.routes (id, origin_city, destination_city, distance_km, estimated_hours)
values
  (
    '50000000-0000-0000-0000-000000000001',
    'Ahmedabad',
    'Mumbai',
    525,
    11
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'Delhi',
    'Jaipur',
    280,
    6
  )
on conflict (id) do nothing;

insert into public.rates (id, carrier_id, route_id, vehicle_type, base_rate, rate_per_km, currency)
values
  (
    '60000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    'Truck',
    15000,
    22,
    'INR'
  ),
  (
    '60000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    '50000000-0000-0000-0000-000000000002',
    'Trailer',
    9000,
    18,
    'INR'
  )
on conflict (id) do nothing;

insert into public.shipments (
  id,
  shipment_number,
  customer_id,
  carrier_id,
  driver_id,
  vehicle_id,
  route_id,
  rate_id,
  origin_location,
  destination_location,
  pickup_date,
  delivery_date,
  weight_kg,
  status
)
values
  (
    '70000000-0000-0000-0000-000000000001',
    'SHP-20260314-090000',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    '60000000-0000-0000-0000-000000000001',
    'Ahmedabad Warehouse',
    'Mumbai Distribution Center',
    '2026-03-14',
    '2026-03-15',
    8500,
    'in_transit'
  )
on conflict (id) do nothing;

insert into public.tracking_events (id, shipment_id, event_type, location, notes, created_at)
values
  (
    '80000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000001',
    'created',
    'Ahmedabad Warehouse',
    'Shipment created by dispatcher',
    timezone('utc', now()) - interval '8 hours'
  ),
  (
    '80000000-0000-0000-0000-000000000002',
    '70000000-0000-0000-0000-000000000001',
    'assigned',
    'Ahmedabad Warehouse',
    'Carrier and vehicle assigned',
    timezone('utc', now()) - interval '6 hours'
  ),
  (
    '80000000-0000-0000-0000-000000000003',
    '70000000-0000-0000-0000-000000000001',
    'in_transit',
    'Vadodara',
    'Shipment departed origin facility',
    timezone('utc', now()) - interval '2 hours'
  )
on conflict (id) do nothing;
