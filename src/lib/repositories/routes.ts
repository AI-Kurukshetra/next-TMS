import { SupabaseClient } from "@supabase/supabase-js";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { Route } from "@/types/route";

type CreateRouteInput = {
  originCity: string;
  destinationCity: string;
  distanceKm?: number | null;
  estimatedHours?: number | null;
};

export async function listRoutes(
  supabase: SupabaseClient,
): Promise<Route[]> {
  const { data, error } = await supabase
    .from("routes")
    .select("id, origin_city, destination_city, distance_km, estimated_hours, is_active, created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error);
  return (data ?? []) as Route[];
}

export async function createRoute(
  supabase: SupabaseClient,
  input: CreateRouteInput,
): Promise<Route> {
  const { data, error } = await supabase
    .from("routes")
    .insert({
      origin_city: input.originCity,
      destination_city: input.destinationCity,
      distance_km: input.distanceKm ?? null,
      estimated_hours: input.estimatedHours ?? null,
    })
    .select("id, origin_city, destination_city, distance_km, estimated_hours, is_active, created_at")
    .single();

  throwIfSupabaseError(error);

  if (!data) {
    throw new Error("Route creation returned no data");
  }

  return data as Route;
}
