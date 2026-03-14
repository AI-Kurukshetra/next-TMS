import { SupabaseClient } from "@supabase/supabase-js";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { Carrier } from "@/types/carrier";

type CreateCarrierInput = {
  companyName: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  mcNumber?: string | null;
  dotNumber?: string | null;
};

export async function listCarriersCatalog(
  supabase: SupabaseClient,
): Promise<Carrier[]> {
  const { data, error } = await supabase
    .from("carriers")
    .select("id, company_name, contact_name, email, phone, mc_number, dot_number, created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error);
  return (data ?? []) as Carrier[];
}

export async function listCarrierOptions(
  supabase: SupabaseClient,
): Promise<Array<{ id: string; name: string }>> {
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

export async function createCarrier(
  supabase: SupabaseClient,
  input: CreateCarrierInput,
): Promise<Carrier> {
  const { data, error } = await supabase
    .from("carriers")
    .insert({
      company_name: input.companyName,
      contact_name: input.contactName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      mc_number: input.mcNumber ?? null,
      dot_number: input.dotNumber ?? null,
    })
    .select("id, company_name, contact_name, email, phone, mc_number, dot_number, created_at")
    .single();

  throwIfSupabaseError(error);

  if (!data) {
    throw new Error("Carrier creation returned no data");
  }

  return data as Carrier;
}
