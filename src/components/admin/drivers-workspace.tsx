"use client";

import { FormEvent, useEffect, useState } from "react";
import { ResourceSection } from "@/components/ui/resource-section";
import { fetchJson, withAuth } from "@/lib/api/client";
import { canCreateDriver } from "@/lib/auth/roles";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { Driver } from "@/types/driver";

export function DriversWorkspace() {
  const { loading, session, user } = useCurrentAppUser();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [carriers, setCarriers] = useState<Array<{ id: string; company_name: string }>>([]);
  const [carrierId, setCarrierId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!session) {
      return;
    }

    const [driverRows, carrierRows] = await Promise.all([
      fetchJson<Driver[]>("/api/drivers", withAuth(session.access_token)),
      fetchJson<Array<{ id: string; company_name: string }>>(
        "/api/carriers",
        withAuth(session.access_token),
      ),
    ]);
    setDrivers(driverRows);
    setCarriers(carrierRows);
  }

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    load().catch((nextError) =>
      setError(nextError instanceof Error ? nextError.message : "Failed to load drivers."),
    );
  }, [session, user]);

  if (loading || !user) {
    return <div className="text-sm text-slate-500">Loading drivers...</div>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await fetchJson(
        "/api/drivers",
        withAuth(session!.access_token, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carrierId,
            fullName,
            phone,
            licenseNumber,
          }),
        }),
      );
      setCarrierId("");
      setFullName("");
      setPhone("");
      setLicenseNumber("");
      await load();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Failed to create driver.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {canCreateDriver(user.role) ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Create Driver</h2>
            <p className="text-sm text-slate-600">
              Add a driver profile before assigning shipments to that operator.
            </p>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <select
              value={carrierId}
              onChange={(event) => setCarrierId(event.target.value)}
              required
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select carrier</option>
              {carriers.map((carrier) => (
                <option key={carrier.id} value={carrier.id}>
                  {carrier.company_name}
                </option>
              ))}
            </select>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              placeholder="Driver name"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={licenseNumber}
              onChange={(event) => setLicenseNumber(event.target.value)}
              placeholder="License number"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            {error ? (
              <p className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Driver"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <ResourceSection
        title="Driver Roster"
        description="Driver records that can be linked to vehicles and shipments."
        rows={drivers}
        emptyMessage="No drivers have been created yet."
        columns={[
          {
            header: "Driver",
            render: (driver) => (
              <span className="font-medium text-slate-900">{driver.full_name}</span>
            ),
          },
          {
            header: "Carrier",
            render: (driver) => driver.carrier_id,
          },
          {
            header: "Phone",
            render: (driver) => driver.phone ?? "-",
          },
          {
            header: "Linked User",
            render: (driver) => driver.user_id ?? "-",
          },
        ]}
      />
    </div>
  );
}
