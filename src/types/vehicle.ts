export type VehicleStatus = "available" | "in_use" | "maintenance";

export type Vehicle = {
  id: string;
  carrier_id: string;
  driver_id: string | null;
  vehicle_number: string;
  vehicle_type: string | null;
  capacity_kg: number | null;
  status: VehicleStatus;
  created_at: string;
};
