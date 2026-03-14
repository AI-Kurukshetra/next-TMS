export type Rate = {
  id: string;
  carrier_id: string | null;
  route_id: string;
  vehicle_type: string | null;
  base_rate: number;
  rate_per_km: number | null;
  currency: string;
  is_active: boolean;
  created_at: string;
};
