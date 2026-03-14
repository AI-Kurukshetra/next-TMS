export type Route = {
  id: string;
  origin_city: string;
  destination_city: string;
  distance_km: number | null;
  estimated_hours: number | null;
  is_active: boolean;
  created_at: string;
};
