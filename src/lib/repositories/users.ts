import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { isUserRole } from "@/lib/auth/roles";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { AppUser, UserRole } from "@/types/user";

export type UpdateAppUserAccessInput = {
  userId: string;
  role: UserRole;
  carrierId?: string | null;
  customerId?: string | null;
  driverId?: string | null;
};

function isMissingCustomerIdColumn(error: PostgrestError | null) {
  return Boolean(
    error &&
      error.message.includes("customer_id") &&
      error.message.includes("users"),
  );
}

function normalizeLegacyUserRow(
  row: Omit<AppUser, "customer_id"> & { customer_id?: string | null },
): AppUser {
  return {
    ...row,
    customer_id: row.customer_id ?? null,
  };
}

export async function getCurrentAppUser(
  supabase: SupabaseClient,
  accessToken?: string,
): Promise<AppUser | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError) {
    throw authError;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role, carrier_id, customer_id, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error?.code === "PGRST116") {
    return null;
  }

  if (isMissingCustomerIdColumn(error)) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("users")
      .select("id, full_name, email, role, carrier_id, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (legacyError?.code === "PGRST116") {
      return null;
    }

    throwIfSupabaseError(legacyError);
    return legacyData ? normalizeLegacyUserRow(legacyData as AppUser) : null;
  }

  throwIfSupabaseError(error);
  return data ? normalizeLegacyUserRow(data as AppUser) : null;
}

export async function listAppUsers(
  supabase: SupabaseClient,
): Promise<AppUser[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role, carrier_id, customer_id, created_at")
    .order("created_at", { ascending: false });

  if (isMissingCustomerIdColumn(error)) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("users")
      .select("id, full_name, email, role, carrier_id, created_at")
      .order("created_at", { ascending: false });

    throwIfSupabaseError(legacyError);
    return (legacyData ?? []).map((row) => normalizeLegacyUserRow(row as AppUser));
  }

  throwIfSupabaseError(error);
  return (data ?? []).map((row) => normalizeLegacyUserRow(row as AppUser));
}

export async function syncCurrentAppUser(
  supabase: SupabaseClient,
  accessToken?: string,
  overrides?: {
    fullName?: string;
    role?: UserRole;
  },
): Promise<AppUser> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError) {
    throw authError;
  }

  if (!user?.email) {
    throw new Error("Authenticated user not found.");
  }

  const metadataRole = user.user_metadata?.role;
  const resolvedRole =
    overrides?.role ??
    (typeof metadataRole === "string" && isUserRole(metadataRole)
      ? metadataRole
      : "customer");

  const fullNameFromMetadata = user.user_metadata?.full_name;
  const resolvedFullName =
    overrides?.fullName?.trim() ||
    (typeof fullNameFromMetadata === "string" && fullNameFromMetadata.trim()) ||
    user.email.split("@")[0];

  let customerId: string | null = null;

  if (resolvedRole === "customer") {
    const { data: existingCustomer, error: existingCustomerError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (existingCustomerError?.code !== "PGRST116") {
      throwIfSupabaseError(existingCustomerError);
    }

    customerId = existingCustomer?.id ?? null;

    if (!customerId) {
      const { data: createdCustomer, error: createCustomerError } = await supabase
        .from("customers")
        .insert({
          company_name: resolvedFullName,
          contact_name: resolvedFullName,
          email: user.email,
        })
        .select("id")
        .single();

      throwIfSupabaseError(createCustomerError);
      customerId = createdCustomer?.id ?? null;
    }
  }

  const upsertPayload = {
    id: user.id,
    email: user.email,
    full_name: resolvedFullName,
    role: resolvedRole,
    customer_id: customerId,
    carrier_id: null,
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(upsertPayload, {
      onConflict: "id",
    })
    .select("id, full_name, email, role, carrier_id, customer_id, created_at")
    .single();

  if (isMissingCustomerIdColumn(error)) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("users")
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: resolvedFullName,
          role: resolvedRole,
          carrier_id: null,
        },
        {
          onConflict: "id",
        },
      )
      .select("id, full_name, email, role, carrier_id, created_at")
      .single();

    throwIfSupabaseError(legacyError);
    return normalizeLegacyUserRow(legacyData as AppUser);
  }

  throwIfSupabaseError(error);
  return normalizeLegacyUserRow(data as AppUser);
}

export async function updateAppUserAccess(
  supabase: SupabaseClient,
  input: UpdateAppUserAccessInput,
): Promise<AppUser> {
  const { data, error } = await supabase
    .from("users")
    .update({
      role: input.role,
      carrier_id:
        input.role === "dispatcher" || input.role === "driver"
          ? input.carrierId ?? null
          : null,
      customer_id: input.role === "customer" ? input.customerId ?? null : null,
    })
    .eq("id", input.userId)
    .select("id, full_name, email, role, carrier_id, customer_id, created_at")
    .single();

  if (isMissingCustomerIdColumn(error)) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("users")
      .update({
        role: input.role,
        carrier_id:
          input.role === "dispatcher" || input.role === "driver"
            ? input.carrierId ?? null
            : null,
      })
      .eq("id", input.userId)
      .select("id, full_name, email, role, carrier_id, created_at")
      .single();

    throwIfSupabaseError(legacyError);

    const { error: clearDriversError } = await supabase
      .from("drivers")
      .update({ user_id: null })
      .eq("user_id", input.userId);

    throwIfSupabaseError(clearDriversError);

    if (input.driverId) {
      const { error: assignDriverError } = await supabase
        .from("drivers")
        .update({ user_id: input.userId })
        .eq("id", input.driverId);

      throwIfSupabaseError(assignDriverError);
    }

    return normalizeLegacyUserRow(legacyData as AppUser);
  }

  throwIfSupabaseError(error);

  const { error: clearDriversError } = await supabase
    .from("drivers")
    .update({ user_id: null })
    .eq("user_id", input.userId);

  throwIfSupabaseError(clearDriversError);

  if (input.driverId) {
    const { error: assignDriverError } = await supabase
      .from("drivers")
      .update({ user_id: input.userId })
      .eq("id", input.driverId);

    throwIfSupabaseError(assignDriverError);
  }

  return normalizeLegacyUserRow(data as AppUser);
}
