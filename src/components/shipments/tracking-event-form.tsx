"use client";

import { FormEvent, useState } from "react";
import { canAddTrackingEvent } from "@/lib/auth/roles";
import { fetchJson, withAuth } from "@/lib/api/client";
import { AppUser } from "@/types/user";

export function TrackingEventForm({
  accessToken,
  shipmentId,
  onCreated,
  user,
}: {
  accessToken: string;
  shipmentId: string;
  onCreated?: () => void;
  user: AppUser;
}) {
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canAddTrackingEvent(user.role)) {
    return null;
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
            action: "tracking",
            eventType,
            location,
            notes,
          }),
        }),
      );

      setEventType("");
      setLocation("");
      setNotes("");
      onCreated?.();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to add tracking event.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Manual Tracking Event</h2>
        <p className="text-sm text-slate-600">
          Record an operational note or shipment milestone.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="eventType" className="mb-1 block text-sm font-medium">
            Event Type
          </label>
          <input
            id="eventType"
            value={eventType}
            onChange={(event) => setEventType(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            placeholder="arrived_hub"
          />
        </div>

        <div>
          <label htmlFor="eventLocation" className="mb-1 block text-sm font-medium">
            Location
          </label>
          <input
            id="eventLocation"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            placeholder="Mumbai Hub"
          />
        </div>

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
            placeholder="Shipment scanned at sorting facility."
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
          {loading ? "Saving..." : "Add Tracking Event"}
        </button>
      </form>
    </section>
  );
}
