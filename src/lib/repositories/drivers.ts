import { SupabaseClient } from "@supabase/supabase-js";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { Driver } from "@/types/driver";

type CreateDriverInput = {
  carrierId: string;
  fullName: string;
  phone?: string | null;
  licenseNumber?: string | null;
};

export async function listDrivers(
  supabase: SupabaseClient,
): Promise<Driver[]> {
  const { data, error } = await supabase
    .from("drivers")
    .select("id, carrier_id, user_id, full_name, phone, license_number, is_active, created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error);
  return (data ?? []) as Driver[];
}

export async function listDriverOptions(
  supabase: SupabaseClient,
): Promise<Array<{ id: string; full_name: string; carrier_id: string }>> {
  const { data, error } = await supabase
    .from("drivers")
    .select("id, full_name, carrier_id")
    .eq("is_active", true)
    .order("full_name");

  throwIfSupabaseError(error);
  return (
    (data ?? []) as Array<{ id: string; full_name: string; carrier_id: string }>
  );
}

export async function getDriverByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<Driver | null> {
  const { data, error } = await supabase
    .from("drivers")
    .select("id, carrier_id, user_id, full_name, phone, license_number, is_active, created_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error?.code === "PGRST116") {
    return null;
  }

  throwIfSupabaseError(error);
  return (data ?? null) as Driver | null;
}

export async function createDriver(
  supabase: SupabaseClient,
  input: CreateDriverInput,
): Promise<Driver> {
  const { data, error } = await supabase
    .from("drivers")
    .insert({
      carrier_id: input.carrierId,
      full_name: input.fullName,
      phone: input.phone ?? null,
      license_number: input.licenseNumber ?? null,
    })
    .select("id, carrier_id, user_id, full_name, phone, license_number, is_active, created_at")
    .single();

  throwIfSupabaseError(error);

  if (!data) {
    throw new Error("Driver creation returned no data");
  }

  return data as Driver;
}
