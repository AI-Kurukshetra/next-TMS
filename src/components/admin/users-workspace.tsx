"use client";

import { useEffect, useState } from "react";
import { USER_ROLE_OPTIONS } from "@/lib/auth/roles";
import { fetchJson, withAuth } from "@/lib/api/client";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { AppUser, UserRole } from "@/types/user";

type OptionRow = { id: string; label: string };

export function UsersWorkspace() {
  const { loading, session, user } = useCurrentAppUser();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [carriers, setCarriers] = useState<OptionRow[]>([]);
  const [customers, setCustomers] = useState<OptionRow[]>([]);
  const [drivers, setDrivers] = useState<OptionRow[]>([]);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!session) {
      return;
    }

    const [userRows, carrierRows, customerRows, driverRows] = await Promise.all([
      fetchJson<AppUser[]>("/api/users", withAuth(session.access_token)),
      fetchJson<Array<{ id: string; company_name: string }>>(
        "/api/carriers",
        withAuth(session.access_token),
      ),
      fetchJson<Array<{ id: string; company_name: string }>>(
        "/api/customers",
        withAuth(session.access_token),
      ),
      fetchJson<Array<{ id: string; full_name: string }>>(
        "/api/drivers",
        withAuth(session.access_token),
      ),
    ]);

    setUsers(userRows);
    setCarriers(carrierRows.map((row) => ({ id: row.id, label: row.company_name })));
    setCustomers(
      customerRows.map((row) => ({ id: row.id, label: row.company_name })),
    );
    setDrivers(driverRows.map((row) => ({ id: row.id, label: row.full_name })));
  }

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    load().catch((nextError) =>
      setError(nextError instanceof Error ? nextError.message : "Failed to load users."),
    );
  }, [session, user]);

  if (loading || !user) {
    return <div className="text-sm text-slate-500">Loading users...</div>;
  }

  async function handleUpdate(
    userId: string,
    role: UserRole,
    carrierId?: string,
    customerId?: string,
    driverId?: string,
  ) {
    setSavingUserId(userId);
    setError(null);

    try {
      await fetchJson(
        "/api/users",
        withAuth(session!.access_token, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            role,
            carrierId,
            customerId,
            driverId,
          }),
        }),
      );

      await load();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to update user.");
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">User Access Management</h2>
        <p className="text-sm text-slate-600">
          Admins can set roles and link users to carrier, customer, or driver
          records.
        </p>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        {users.map((row) => (
          <UserAccessRow
            key={row.id}
            carriers={carriers}
            customers={customers}
            drivers={drivers}
            onSave={handleUpdate}
            row={row}
            saving={savingUserId === row.id}
          />
        ))}
      </div>
    </section>
  );
}

function UserAccessRow({
  row,
  carriers,
  customers,
  drivers,
  saving,
  onSave,
}: {
  row: AppUser;
  carriers: OptionRow[];
  customers: OptionRow[];
  drivers: OptionRow[];
  saving: boolean;
  onSave: (
    userId: string,
    role: UserRole,
    carrierId?: string,
    customerId?: string,
    driverId?: string,
  ) => void;
}) {
  const [role, setRole] = useState<UserRole>(row.role);
  const [carrierId, setCarrierId] = useState(row.carrier_id ?? "");
  const [customerId, setCustomerId] = useState(row.customer_id ?? "");
  const [driverId, setDriverId] = useState("");

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-3">
        <div className="font-medium text-slate-900">{row.full_name}</div>
        <div className="text-sm text-slate-500">{row.email}</div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          {USER_ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={carrierId}
          onChange={(event) => setCarrierId(event.target.value)}
          disabled={role !== "dispatcher" && role !== "driver"}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
        >
          <option value="">No carrier</option>
          {carriers.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          disabled={role !== "customer"}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
        >
          <option value="">No customer</option>
          {customers.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={driverId}
          onChange={(event) => setDriverId(event.target.value)}
          disabled={role !== "driver"}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
        >
          <option value="">No driver link</option>
          {drivers.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => onSave(row.id, role, carrierId, customerId, driverId)}
          disabled={saving}
          className="inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Access"}
        </button>
      </div>
    </div>
  );
}
