"use client";

import { useEffect, useState } from "react";
import { AssignShipmentForm } from "@/components/shipments/assign-shipment-form";
import { ShipmentStatusBadge } from "@/components/shipments/shipment-status-badge";
import { ShipmentStatusForm } from "@/components/shipments/shipment-status-form";
import { TrackingEventForm } from "@/components/shipments/tracking-event-form";
import { TrackingTimeline } from "@/components/shipments/tracking-timeline";
import { fetchJson, withAuth } from "@/lib/api/client";
import { canAssignShipment } from "@/lib/auth/roles";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import {
  CarrierOption,
  DriverOption,
  ShipmentDetails,
  VehicleOption,
} from "@/types/shipment";

export function ShipmentDetailsShell({ shipmentId }: { shipmentId: string }) {
  const { loading, session, user } = useCurrentAppUser();
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [carriers, setCarriers] = useState<CarrierOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!session || !user) {
      return;
    }

    try {
      const nextShipment = await fetchJson<ShipmentDetails>(
        `/api/shipments/${shipmentId}`,
        withAuth(session.access_token),
      );
      setShipment(nextShipment);

      if (canAssignShipment(user.role)) {
        const [carrierRows, vehicleRows, driverRows] = await Promise.all([
          fetchJson<Array<{ id: string; company_name: string }>>(
            "/api/carriers",
            withAuth(session.access_token),
          ),
          fetchJson<VehicleOption[]>("/api/vehicles", withAuth(session.access_token)),
          fetchJson<Array<{ id: string; full_name: string; carrier_id: string }>>(
            "/api/drivers",
            withAuth(session.access_token),
          ),
        ]);

        setCarriers(
          carrierRows.map((carrier) => ({
            id: carrier.id,
            name: carrier.company_name,
          })),
        );
        setVehicles(vehicleRows);
        setDrivers(driverRows);
      }
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Failed to load shipment details.",
      );
    }
  }

  useEffect(() => {
    void load();
  }, [session, user, shipmentId]);

  if (loading || !user) {
    return <div className="text-sm text-slate-500">Loading shipment details...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm">
        Shipment not found or not accessible for your role.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Shipment Number</p>
              <h1 className="text-2xl font-semibold">{shipment.shipment_number}</h1>
              <p className="mt-1 text-sm text-slate-600">
                Customer: {shipment.customer_name ?? shipment.customer_id}
              </p>
            </div>
            <ShipmentStatusBadge status={shipment.status} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Origin</p>
              <p className="mt-1 font-medium">{shipment.origin_location}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Destination</p>
              <p className="mt-1 font-medium">{shipment.destination_location}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Carrier</p>
              <p className="mt-1 font-medium">{shipment.carrier_name ?? "-"}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Driver</p>
              <p className="mt-1 font-medium">{shipment.driver_name ?? "-"}</p>
            </div>
          </div>
        </section>

        {canAssignShipment(user.role) ? (
          <AssignShipmentForm
            accessToken={session!.access_token}
            shipmentId={shipment.id}
            carriers={carriers}
            vehicles={vehicles}
            drivers={drivers}
            onAssigned={load}
            user={user}
          />
        ) : null}

        <ShipmentStatusForm
          accessToken={session!.access_token}
          shipmentId={shipment.id}
          currentStatus={shipment.status}
          onUpdated={load}
          user={user}
        />

        <TrackingEventForm
          accessToken={session!.access_token}
          shipmentId={shipment.id}
          onCreated={load}
          user={user}
        />
      </div>

      <TrackingTimeline events={shipment.tracking_events ?? []} />
    </div>
  );
}
