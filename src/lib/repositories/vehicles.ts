import { SupabaseClient } from "@supabase/supabase-js";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { Vehicle, VehicleStatus } from "@/types/vehicle";

type CreateVehicleInput = {
  carrierId: string;
  driverId?: string | null;
  vehicleNumber: string;
  vehicleType?: string | null;
  capacityKg?: number | null;
  status?: VehicleStatus;
};

export async function listVehiclesCatalog(
  supabase: SupabaseClient,
): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, carrier_id, driver_id, vehicle_number, vehicle_type, capacity_kg, status, created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error);
  return (data ?? []) as Vehicle[];
}

export async function createVehicle(
  supabase: SupabaseClient,
  input: CreateVehicleInput,
): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      carrier_id: input.carrierId,
      driver_id: input.driverId ?? null,
      vehicle_number: input.vehicleNumber,
      vehicle_type: input.vehicleType ?? null,
      capacity_kg: input.capacityKg ?? null,
      status: input.status ?? "available",
    })
    .select("id, carrier_id, driver_id, vehicle_number, vehicle_type, capacity_kg, status, created_at")
    .single();

  throwIfSupabaseError(error);

  if (!data) {
    throw new Error("Vehicle creation returned no data");
  }

  return data as Vehicle;
}
