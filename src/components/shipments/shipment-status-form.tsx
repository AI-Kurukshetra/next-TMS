"use client";

import { FormEvent, useMemo, useState } from "react";
import { canUpdateShipmentStatus } from "@/lib/auth/roles";
import { fetchJson, withAuth } from "@/lib/api/client";
import { ShipmentStatus } from "@/types/shipment";
import { TrackingEventType } from "@/types/tracking";
import { AppUser } from "@/types/user";

type DriverMilestone = {
  label: string;
  status: ShipmentStatus;
  eventType: TrackingEventType;
};

const dispatcherStatuses: Array<{
  label: string;
  status: ShipmentStatus;
  eventType: TrackingEventType;
}> = [
  { label: "Booked", status: "booked", eventType: "created" },
  { label: "Assigned", status: "assigned", eventType: "assigned" },
  { label: "In Transit", status: "in_transit", eventType: "in_transit" },
  { label: "Delivered", status: "delivered", eventType: "delivered" },
  { label: "Cancelled", status: "cancelled", eventType: "exception" },
];

const driverMilestones: DriverMilestone[] = [
  { label: "Pickup Completed", status: "in_transit", eventType: "picked_up" },
  { label: "In Transit", status: "in_transit", eventType: "in_transit" },
  {
    label: "Reached Destination",
    status: "in_transit",
    eventType: "reached_destination",
  },
  { label: "Delivered", status: "delivered", eventType: "delivered" },
];

export function ShipmentStatusForm({
  accessToken,
  shipmentId,
  currentStatus,
  onUpdated,
  user,
}: {
  accessToken: string;
  shipmentId: string;
  currentStatus: ShipmentStatus;
  onUpdated?: () => void;
  user: AppUser;
}) {
  const options = useMemo(
    () => (user.role === "driver" ? driverMilestones : dispatcherStatuses),
    [user.role],
  );
  const [selectedEvent, setSelectedEvent] = useState(options[0]?.eventType ?? "in_transit");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canUpdateShipmentStatus(user.role)) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const selectedOption =
      options.find((option) => option.eventType === selectedEvent) ?? options[0];

    try {
      await fetchJson(
        `/api/shipments/${shipmentId}`,
        withAuth(accessToken, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "status",
            status: selectedOption.status,
            eventType: selectedOption.eventType,
            location,
            notes:
              user.role === "driver"
                ? `Driver marked shipment as ${selectedOption.label}`
                : undefined,
          }),
        }),
      );

      setLocation("");
      onUpdated?.();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to update shipment status.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {user.role === "driver" ? "Delivery Milestones" : "Status Tracking"}
        </h2>
        <p className="text-sm text-slate-600">
          Current shipment status: {currentStatus.replaceAll("_", " ")}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            {user.role === "driver" ? "Milestone" : "Shipment Status"}
          </label>
          <select
            id="status"
            value={selectedEvent}
            onChange={(event) =>
              setSelectedEvent(event.target.value as TrackingEventType)
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
          >
            {options.map((option) => (
              <option key={option.eventType} value={option.eventType}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            Current Location
          </label>
          <input
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            placeholder="Nashik Checkpoint"
          />
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
          {loading ? "Updating..." : "Update Status"}
        </button>
      </form>
    </section>
  );
}
