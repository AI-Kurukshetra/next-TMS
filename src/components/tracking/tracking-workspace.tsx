"use client";

import { useEffect, useState } from "react";
import { ResourceSection } from "@/components/ui/resource-section";
import { fetchJson, withAuth } from "@/lib/api/client";
import { useCurrentAppUser } from "@/lib/auth/use-current-app-user";
import { TrackingEventRecord } from "@/types/tracking";

export function TrackingWorkspace() {
  const { loading, session, user } = useCurrentAppUser();
  const [events, setEvents] = useState<TrackingEventRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    fetchJson<TrackingEventRecord[]>(
      "/api/tracking-feed",
      withAuth(session.access_token),
    )
      .then(setEvents)
      .catch((nextError) =>
        setError(
          nextError instanceof Error ? nextError.message : "Failed to load tracking.",
        ),
      );
  }, [session, user]);

  if (loading || !user) {
    return <div className="text-sm text-slate-500">Loading tracking feed...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <ResourceSection
      title="Tracking Feed"
      description="Chronological shipment tracking records available to your role."
      rows={events}
      emptyMessage="No tracking events have been recorded yet."
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
          render: (event) => new Date(event.created_at).toLocaleString("en-IN"),
        },
      ]}
    />
  );
}
