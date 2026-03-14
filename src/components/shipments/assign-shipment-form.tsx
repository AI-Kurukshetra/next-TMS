"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { canAssignShipment } from "@/lib/auth/roles";
import { fetchJson, withAuth } from "@/lib/api/client";
import { DriverOption, CarrierOption, VehicleOption } from "@/types/shipment";
import { AppUser } from "@/types/user";

export function AssignShipmentForm({
  accessToken,
  shipmentId,
  carriers,
  vehicles,
  drivers,
  onAssigned,
  user,
}: {
  accessToken: string;
  shipmentId: string;
  carriers: CarrierOption[];
  vehicles: VehicleOption[];
  drivers: DriverOption[];
  onAssigned?: () => void;
  user: AppUser;
}) {
  const [carrierId, setCarrierId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carrierVehicles = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          vehicle.carrier_id === carrierId && vehicle.status === "available",
      ),
    [carrierId, vehicles],
  );
  const carrierDrivers = useMemo(
    () => drivers.filter((driver) => driver.carrier_id === carrierId),
    [carrierId, drivers],
  );

  if (!canAssignShipment(user.role)) {
    return null;
  }

  if (!carriers.length || !vehicles.length || !drivers.length) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Dispatch Setup Required</h2>
          <p className="text-sm text-slate-600">
            This shipment cannot be assigned until the required operational records
            exist.
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-700">
          {!carriers.length ? (
            <p>
              No carriers found. Open{" "}
              <Link href="/carriers" className="font-medium underline">
                Carriers
              </Link>{" "}
              to add one.
            </p>
          ) : null}
          {!drivers.length ? (
            <p>
              No drivers found. Open{" "}
              <Link href="/drivers" className="font-medium underline">
                Drivers
              </Link>{" "}
              to create one.
            </p>
          ) : null}
          {!vehicles.length ? (
            <p>
              No vehicles found. Open{" "}
              <Link href="/vehicles" className="font-medium underline">
                Vehicles
              </Link>{" "}
              to create one.
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetchJson(
        `/api/shipments/${shipmentId}`,
        withAuth(accessToken, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "assign",
            carrierId,
            vehicleId,
            driverId,
          }),
        }),
      );

      setCarrierId("");
      setVehicleId("");
      setDriverId("");
      onAssigned?.();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to assign shipment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Assign Carrier, Driver, and Vehicle</h2>
        <p className="text-sm text-slate-600">
          Dispatch the shipment to an operating carrier team.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="carrierId" className="mb-1 block text-sm font-medium">
            Carrier
          </label>
          <select
            id="carrierId"
            required
            value={carrierId}
            onChange={(event) => {
              setCarrierId(event.target.value);
              setVehicleId("");
              setDriverId("");
            }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
          >
            <option value="">Select carrier</option>
            {carriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="driverId" className="mb-1 block text-sm font-medium">
            Driver
          </label>
          <select
            id="driverId"
            required
            disabled={!carrierId}
            value={driverId}
            onChange={(event) => setDriverId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 disabled:bg-slate-100"
          >
            <option value="">Select driver</option>
            {carrierDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vehicleId" className="mb-1 block text-sm font-medium">
            Vehicle
          </label>
          <select
            id="vehicleId"
            required
            disabled={!carrierId}
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 disabled:bg-slate-100"
          >
            <option value="">Select vehicle</option>
            {carrierVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicle_number}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign Shipment"}
        </button>
      </form>
    </section>
  );
}
