import { SupabaseClient } from "@supabase/supabase-js";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { Rate } from "@/types/rate";

type CreateRateInput = {
  routeId: string;
  carrierId?: string | null;
  vehicleType?: string | null;
  baseRate: number;
  ratePerKm?: number | null;
  currency?: string | null;
};

export async function listRates(
  supabase: SupabaseClient,
): Promise<Rate[]> {
  const { data, error } = await supabase
    .from("rates")
    .select("id, carrier_id, route_id, vehicle_type, base_rate, rate_per_km, currency, is_active, created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error);
  return (data ?? []) as Rate[];
}

export async function createRate(
  supabase: SupabaseClient,
  input: CreateRateInput,
): Promise<Rate> {
  const { data, error } = await supabase
    .from("rates")
    .insert({
      route_id: input.routeId,
      carrier_id: input.carrierId ?? null,
      vehicle_type: input.vehicleType ?? null,
      base_rate: input.baseRate,
      rate_per_km: input.ratePerKm ?? null,
      currency: input.currency ?? "INR",
    })
    .select("id, carrier_id, route_id, vehicle_type, base_rate, rate_per_km, currency, is_active, created_at")
    .single();

  throwIfSupabaseError(error);

  if (!data) {
    throw new Error("Rate creation returned no data");
  }

  return data as Rate;
}
