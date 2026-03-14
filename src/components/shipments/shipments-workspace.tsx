"use client";

import { useEffect, useState } from "react";
import { ShipmentForm } from "@/components/shipments/shipment-form";
import { ShipmentsTable } from "@/components/shipments/shipments-table";
import { fetchJson, withAuth } from "@/lib/api/client";
import { canCreateShipment } from "@/lib/auth/roles";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { Shipment, ShipmentSummary } from "@/types/shipment";

export function ShipmentsWorkspace() {
  const { loading, session, user } = useCurrentAppUser();
  const [shipments, setShipments] = useState<ShipmentSummary[]>([]);
  const [customers, setCustomers] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    fetchJson<ShipmentSummary[]>("/api/shipments", withAuth(session.access_token))
      .then(setShipments)
      .catch((nextError) =>
        setError(
          nextError instanceof Error ? nextError.message : "Failed to load shipments.",
        ),
      );

    if (user.role === "admin" || user.role === "dispatcher") {
      fetchJson<
        Array<{
          id: string;
          company_name: string;
        }>
      >("/api/customers", withAuth(session.access_token))
        .then((rows) =>
          setCustomers(rows.map((row) => ({ id: row.id, name: row.company_name }))),
        )
        .catch(() => undefined);
    }
  }, [session, user]);

  function handleCreated(shipment: Shipment) {
    if (!session) {
      return;
    }

    fetchJson<ShipmentSummary[]>("/api/shipments", withAuth(session.access_token)).then(
      setShipments,
    );
  }

  if (loading || !user) {
    return <div className="text-sm text-slate-500">Loading shipments...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <section
      className={
        canCreateShipment(user.role)
          ? "grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
          : "space-y-6"
      }
    >
      {canCreateShipment(user.role) ? (
        <ShipmentForm
          accessToken={session!.access_token}
          customers={customers}
          onCreated={handleCreated}
          user={user}
        />
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            {user.role === "driver" ? "Assigned Shipments" : "Latest Shipments"}
          </h2>
          <p className="text-sm text-slate-600">
            {user.role === "customer"
              ? "Your shipment requests and delivery history."
              : user.role === "driver"
                ? "Loads currently assigned to your driver profile."
                : "Operational shipment queue with assignment and status."}
          </p>
        </div>
        <ShipmentsTable
          shipments={shipments}
          viewerRole={user.role}
          emptyMessage={
            user.role === "customer"
              ? "No shipment requests found for your account."
              : user.role === "driver"
                ? "No shipments are assigned to your driver profile."
                : "No shipments found."
          }
        />
      </div>
    </section>
  );
}
