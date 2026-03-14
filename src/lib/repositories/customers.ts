import { SupabaseClient } from "@supabase/supabase-js";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { Customer } from "@/types/customer";

type CreateCustomerInput = {
  companyName: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  billingAddress?: string | null;
};

export async function listCustomers(
  supabase: SupabaseClient,
): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, company_name, contact_name, email, phone, billing_address, created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error);
  return (data ?? []) as Customer[];
}

export async function listCustomerOptions(
  supabase: SupabaseClient,
): Promise<Array<{ id: string; name: string }>> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, company_name")
    .order("company_name");

  throwIfSupabaseError(error);

  return (data ?? []).map((customer) => ({
    id: customer.id,
    name: customer.company_name,
  }));
}

export async function createCustomer(
  supabase: SupabaseClient,
  input: CreateCustomerInput,
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      company_name: input.companyName,
      contact_name: input.contactName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      billing_address: input.billingAddress ?? null,
    })
    .select("id, company_name, contact_name, email, phone, billing_address, created_at")
    .single();

  throwIfSupabaseError(error);

  if (!data) {
    throw new Error("Customer creation returned no data");
  }

  return data as Customer;
}
