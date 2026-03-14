import { SupabaseClient } from "@supabase/supabase-js";
import { getDriverByUserId } from "@/lib/repositories/drivers";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { generateShipmentNumber } from "@/lib/utils/shipment-number";
import {
  CarrierOption,
  DriverOption,
  Shipment,
  ShipmentDetails,
  ShipmentStatus,
  ShipmentSummary,
  TrackingEvent,
  VehicleOption,
} from "@/types/shipment";
import { TrackingEventType, isTrackingEventType } from "@/types/tracking";
import { AppUser } from "@/types/user";

type ShipmentRow = {
  id: string;
  shipment_number: string;
  customer_id: string;
  carrier_id: string | null;
  driver_id: string | null;
  vehicle_id: string | null;
  route_id: string | null;
  created_by: string | null;
  origin_location: string;
  destination_location: string;
  weight_kg: number | null;
  status: ShipmentStatus;
  created_at: string;
  updated_at: string;
};

type CreateShipmentInput = {
  customerId: string;
  originLocation: string;
  destinationLocation: string;
  weightKg?: number | null;
  createdBy?: string;
  status?: ShipmentStatus;
  requestLabel?: string;
};

type AssignShipmentInput = {
  shipmentId: string;
  carrierId: string;
  vehicleId: string;
  driverId: string;
  updatedBy?: string;
};

type UpdateShipmentStatusInput = {
  shipmentId: string;
  status: ShipmentStatus;
  location?: string;
  eventType?: TrackingEventType;
  notes?: string;
  updatedBy?: string;
};

type AddTrackingEventInput = {
  shipmentId: string;
  eventType: TrackingEventType;
  location?: string;
  notes?: string;
  createdBy?: string;
};

type NameLookup = Map<string, string>;

async function getNameMap(
  supabase: SupabaseClient,
  table: "customers" | "carriers" | "drivers",
  column: "company_name" | "full_name",
  ids: string[],
): Promise<NameLookup> {
  if (!ids.length) {
    return new Map();
  }

  const { data, error } = await supabase
    .from(table)
    .select(`id, ${column}`)
    .in("id", ids);

  throwIfSupabaseError(error);

  return new Map(
    (data ?? []).map((row) => [
      row.id,
      String((row as Record<string, unknown>)[column] ?? "") || row.id,
    ]),
  );
}

async function getVehicleMap(
  supabase: SupabaseClient,
  ids: string[],
): Promise<NameLookup> {
  if (!ids.length) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("vehicles")
    .select("id, vehicle_number")
    .in("id", ids);

  throwIfSupabaseError(error);

  return new Map(
    (data ?? []).map((row) => [row.id, row.vehicle_number as string]),
  );
}

async function enrichShipmentSummaries(
  supabase: SupabaseClient,
  rows: ShipmentRow[],
): Promise<ShipmentSummary[]> {
  const customerIds = Array.from(new Set(rows.map((row) => row.customer_id)));
  const carrierIds = Array.from(
    new Set(rows.flatMap((row) => (row.carrier_id ? [row.carrier_id] : []))),
  );
  const driverIds = Array.from(
    new Set(rows.flatMap((row) => (row.driver_id ? [row.driver_id] : []))),
  );
  const vehicleIds = Array.from(
    new Set(rows.flatMap((row) => (row.vehicle_id ? [row.vehicle_id] : []))),
  );

  const [customersById, carriersById, driversById, vehiclesById] =
    await Promise.all([
      getNameMap(supabase, "customers", "company_name", customerIds),
      getNameMap(supabase, "carriers", "company_name", carrierIds),
      getNameMap(supabase, "drivers", "full_name", driverIds),
      getVehicleMap(supabase, vehicleIds),
    ]);

  return rows.map((row) => ({
    id: row.id,
    shipment_number: row.shipment_number,
    customer_id: row.customer_id,
    origin_location: row.origin_location,
    destination_location: row.destination_location,
    weight_kg: row.weight_kg,
    status: row.status,
    customer_name: customersById.get(row.customer_id) ?? null,
    carrier_name: row.carrier_id ? carriersById.get(row.carrier_id) ?? null : null,
    driver_name: row.driver_id ? driversById.get(row.driver_id) ?? null : null,
    vehicle_number: row.vehicle_id
      ? vehiclesById.get(row.vehicle_id) ?? null
      : null,
    created_at: row.created_at,
  }));
}

export async function listShipments(
  supabase: SupabaseClient,
  filters?: {
    customerId?: string;
    driverId?: string;
  },
): Promise<ShipmentSummary[]> {
  let query = supabase
    .from("shipments")
    .select(
      `
        id,
        shipment_number,
        customer_id,
        carrier_id,
        driver_id,
        vehicle_id,
        route_id,
        created_by,
        origin_location,
        destination_location,
        weight_kg,
        status,
        created_at,
        updated_at
      `,
    )
    .order("created_at", { ascending: false });

  if (filters?.customerId) {
    query = query.eq("customer_id", filters.customerId);
  }

  if (filters?.driverId) {
    query = query.eq("driver_id", filters.driverId);
  }

  const { data, error } = await query;

  throwIfSupabaseError(error);

  return enrichShipmentSummaries(supabase, (data ?? []) as ShipmentRow[]);
}

export async function listShipmentsForUser(
  supabase: SupabaseClient,
  user: AppUser,
): Promise<ShipmentSummary[]> {
  if (user.role === "customer") {
    if (!user.customer_id) {
      return [];
    }

    return listShipments(supabase, { customerId: user.customer_id });
  }

  if (user.role === "driver") {
    const driver = await getDriverByUserId(supabase, user.id);

    if (!driver) {
      return [];
    }

    return listShipments(supabase, { driverId: driver.id });
  }

  return listShipments(supabase);
}

export async function getShipmentById(
  supabase: SupabaseClient,
  shipmentId: string,
): Promise<ShipmentDetails | null> {
  const { data, error } = await supabase
    .from("shipments")
    .select(
      `
        id,
        shipment_number,
        customer_id,
        carrier_id,
        driver_id,
        vehicle_id,
        route_id,
        created_by,
        origin_location,
        destination_location,
        weight_kg,
        status,
        created_at,
        updated_at
      `,
    )
    .eq("id", shipmentId)
    .maybeSingle();

  if (error?.code === "PGRST116") {
    return null;
  }

  throwIfSupabaseError(error);

  if (!data) {
    return null;
  }

  const [summary] = await enrichShipmentSummaries(supabase, [data as ShipmentRow]);

  const { data: events, error: trackingError } = await supabase
    .from("tracking_events")
    .select("id, shipment_id, event_type, location, notes, created_at")
    .eq("shipment_id", shipmentId)
    .order("created_at", { ascending: false });

  throwIfSupabaseError(trackingError);

  return {
    ...summary,
    id: data.id,
    shipment_number: data.shipment_number,
    customer_id: data.customer_id,
    carrier_id: data.carrier_id,
    driver_id: data.driver_id,
    vehicle_id: data.vehicle_id,
    route_id: data.route_id,
    created_by: data.created_by,
    origin_location: data.origin_location,
    destination_location: data.destination_location,
    weight_kg: data.weight_kg,
    status: data.status as ShipmentStatus,
    created_at: data.created_at,
    updated_at: data.updated_at,
    tracking_events: (events ?? []) as TrackingEvent[],
  };
}

export async function getShipmentByIdForUser(
  supabase: SupabaseClient,
  user: AppUser,
  shipmentId: string,
): Promise<ShipmentDetails | null> {
  const shipment = await getShipmentById(supabase, shipmentId);

  if (!shipment) {
    return null;
  }

  if (user.role === "customer") {
    return shipment.customer_id === user.customer_id ? shipment : null;
  }

  if (user.role === "driver") {
    const driver = await getDriverByUserId(supabase, user.id);
    return driver && shipment.driver_id === driver.id ? shipment : null;
  }

  return shipment;
}

export async function createShipmentRecord(
  supabase: SupabaseClient,
  input: CreateShipmentInput,
): Promise<Shipment> {
  const shipmentNumber = generateShipmentNumber();
  const nextStatus = input.status ?? "booked";

  const { data, error } = await supabase
    .from("shipments")
    .insert({
      shipment_number: shipmentNumber,
      customer_id: input.customerId,
      created_by: input.createdBy ?? null,
      origin_location: input.originLocation,
      destination_location: input.destinationLocation,
      weight_kg: input.weightKg ?? null,
      status: nextStatus,
    })
    .select(
      `
        id,
        shipment_number,
        customer_id,
        carrier_id,
        driver_id,
        vehicle_id,
        route_id,
        created_by,
        origin_location,
        destination_location,
        weight_kg,
        status,
        created_at,
        updated_at
      `,
    )
    .single();

  throwIfSupabaseError(error);

  if (!data) {
    throw new Error("Shipment creation returned no data");
  }

  await addTrackingEvent(supabase, {
    shipmentId: data.id,
    eventType: "created",
    location: input.originLocation,
    notes: input.requestLabel ?? "Shipment created",
    createdBy: input.createdBy,
  });

  return {
    id: data.id,
    shipment_number: data.shipment_number,
    customer_id: data.customer_id,
    carrier_id: data.carrier_id,
    driver_id: data.driver_id,
    vehicle_id: data.vehicle_id,
    route_id: data.route_id,
    created_by: data.created_by,
    origin_location: data.origin_location,
    destination_location: data.destination_location,
    weight_kg: data.weight_kg,
    status: data.status as ShipmentStatus,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function assignShipmentResources(
  supabase: SupabaseClient,
  input: AssignShipmentInput,
) {
  const { data, error } = await supabase
    .from("shipments")
    .update({
      carrier_id: input.carrierId,
      driver_id: input.driverId,
      vehicle_id: input.vehicleId,
      status: "assigned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.shipmentId)
    .select()
    .single();

  throwIfSupabaseError(error);

  await addTrackingEvent(supabase, {
    shipmentId: input.shipmentId,
    eventType: "assigned",
    notes: "Carrier, driver, and vehicle assigned",
    createdBy: input.updatedBy,
  });

  return data;
}

export async function updateShipmentStatus(
  supabase: SupabaseClient,
  input: UpdateShipmentStatusInput,
) {
  const { data, error } = await supabase
    .from("shipments")
    .update({
      status: input.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.shipmentId)
    .select()
    .single();

  throwIfSupabaseError(error);

  const fallbackEventType = isTrackingEventType(input.status)
    ? input.status
    : input.status === "booked"
      ? "created"
      : input.status === "cancelled"
        ? "exception"
        : "in_transit";

  await addTrackingEvent(supabase, {
    shipmentId: input.shipmentId,
    eventType: input.eventType ?? fallbackEventType,
    location: input.location,
    notes:
      input.notes ?? `Shipment status updated to ${input.status.replaceAll("_", " ")}`,
    createdBy: input.updatedBy,
  });

  return data;
}

export async function addTrackingEvent(
  supabase: SupabaseClient,
  input: AddTrackingEventInput,
) {
  const { data, error } = await supabase
    .from("tracking_events")
    .insert({
      shipment_id: input.shipmentId,
      event_type: input.eventType,
      location: input.location ?? null,
      notes: input.notes ?? null,
      created_by: input.createdBy ?? null,
    })
    .select()
    .single();

  throwIfSupabaseError(error);
  return data;
}

export async function listCarriers(
  supabase: SupabaseClient,
): Promise<CarrierOption[]> {
  const { data, error } = await supabase
    .from("carriers")
    .select("id, company_name")
    .order("company_name");

  throwIfSupabaseError(error);

  return (data ?? []).map((carrier) => ({
    id: carrier.id,
    name: carrier.company_name,
  }));
}

export async function listVehicles(
  supabase: SupabaseClient,
): Promise<VehicleOption[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, vehicle_number, carrier_id, status")
    .order("vehicle_number");

  throwIfSupabaseError(error);
  return (data ?? []) as VehicleOption[];
}

export async function listDriverAssignmentOptions(
  supabase: SupabaseClient,
): Promise<DriverOption[]> {
  const { data, error } = await supabase
    .from("drivers")
    .select("id, full_name, carrier_id")
    .eq("is_active", true)
    .order("full_name");

  throwIfSupabaseError(error);
  return (data ?? []) as DriverOption[];
}
