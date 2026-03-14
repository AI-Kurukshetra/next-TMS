"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ShipmentsTable } from "@/components/shipments/shipments-table";
import { ResourceSection } from "@/components/ui/resource-section";
import { fetchJson, withAuth } from "@/lib/api/client";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { DashboardOverview } from "@/types/dashboard";

export function DashboardWorkspace() {
  const { loading, session, user } = useCurrentAppUser();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    fetchJson<DashboardOverview>(
      "/api/dashboard",
      withAuth(session.access_token),
    )
      .then(setOverview)
      .catch((nextError) =>
        setError(
          nextError instanceof Error ? nextError.message : "Failed to load dashboard.",
        ),
      );
  }, [session, user]);

  if (loading || !user) {
    return <div className="text-sm text-slate-500">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </section>

      <section className="grid gap-6 grid-cols-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {user.role === "customer"
                ? "Shipment History"
                : user.role === "driver"
                  ? "Assigned Shipments"
                  : "Recent Shipments"}
            </h2>
            <p className="text-sm text-slate-600">
              Role-specific shipment visibility for your operational workspace.
            </p>
          </div>
          <ShipmentsTable shipments={overview.recentShipments} viewerRole={user.role} />
        </div>

        <ResourceSection
          title="Recent Tracking Events"
          description="Latest shipment milestones available to your role."
          rows={overview.recentTrackingEvents}
          emptyMessage="No tracking activity has been recorded yet."
          columns={[
            {
              header: "Event",
              render: (event) => (
                <span className="font-medium text-slate-900">
                  {event.event_type.replaceAll("_", " ")}
                </span>
              ),
            },
            {
              header: "Shipment",
              render: (event) => event.shipment_id,
            },
            {
              header: "Location",
              render: (event) => event.location ?? "-",
            },
            {
              header: "Time",
              render: (event) =>
                new Date(event.created_at).toLocaleString("en-IN"),
            },
          ]}
        />
      </section>
    </>
  );
}
