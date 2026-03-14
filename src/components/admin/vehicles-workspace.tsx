"use client";

import { FormEvent, useEffect, useState } from "react";
import { ResourceSection } from "@/components/ui/resource-section";
import { fetchJson, withAuth } from "@/lib/api/client";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { Vehicle } from "@/types/vehicle";

export function VehiclesWorkspace() {
  const { loading, session, user } = useCurrentAppUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [carriers, setCarriers] = useState<Array<{ id: string; company_name: string }>>(
    [],
  );
  const [carrierId, setCarrierId] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!session) {
      return;
    }

    const [vehicleRows, carrierRows] = await Promise.all([
      fetchJson<Vehicle[]>("/api/vehicles", withAuth(session.access_token)),
      fetchJson<Array<{ id: string; company_name: string }>>(
        "/api/carriers",
        withAuth(session.access_token),
      ),
    ]);

    setVehicles(vehicleRows);
    setCarriers(carrierRows);
  }

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    load().catch((nextError) =>
      setError(
        nextError instanceof Error ? nextError.message : "Failed to load vehicles.",
      ),
    );
  }, [session, user]);

  if (loading || !user) {
    return <div className="text-sm text-slate-500">Loading vehicles...</div>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await fetchJson(
        "/api/vehicles",
        withAuth(session!.access_token, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carrierId,
            vehicleNumber,
            vehicleType,
            capacityKg,
          }),
        }),
      );

      setCarrierId("");
      setVehicleNumber("");
      setVehicleType("");
      setCapacityKg("");
      await load();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Failed to create vehicle.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Create Vehicle</h2>
          <p className="text-sm text-slate-600">
            Add fleet records so dispatchers can assign them to customer shipment
            requests.
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
            value={vehicleNumber}
            onChange={(event) => setVehicleNumber(event.target.value)}
            required
            placeholder="Vehicle number"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={vehicleType}
            onChange={(event) => setVehicleType(event.target.value)}
            placeholder="Vehicle type"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={capacityKg}
            onChange={(event) => setCapacityKg(event.target.value)}
            placeholder="Capacity (kg)"
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
              {submitting ? "Creating..." : "Create Vehicle"}
            </button>
          </div>
        </form>
      </section>

      <ResourceSection
        title="Fleet"
        description="Vehicle inventory with capacity and assignment readiness."
        rows={vehicles}
        emptyMessage="No vehicles have been created yet."
        columns={[
          {
            header: "Vehicle",
            render: (vehicle) => (
              <span className="font-medium text-slate-900">
                {vehicle.vehicle_number}
              </span>
            ),
          },
          {
            header: "Carrier",
            render: (vehicle) => vehicle.carrier_id,
          },
          {
            header: "Type",
            render: (vehicle) => vehicle.vehicle_type ?? "-",
          },
          {
            header: "Status",
            render: (vehicle) => vehicle.status,
          },
        ]}
      />
    </div>
  );
}
