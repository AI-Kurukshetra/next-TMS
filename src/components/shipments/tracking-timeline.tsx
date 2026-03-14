import { TrackingEvent } from "@/types/shipment";

export function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Tracking Timeline</h2>
        <p className="text-sm text-slate-600">
          Append-only shipment history from creation to delivery.
        </p>
      </div>

      {!events.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
          No tracking events yet.
        </div>
      ) : (
        <div className="space-y-5">
          {events.map((event) => (
            <div key={event.id} className="relative pl-6">
              <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-slate-900" />
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium capitalize">
                      {event.event_type.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {event.location ?? "Location not provided"}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
                {event.notes ? (
                  <p className="mt-3 text-sm text-slate-700">{event.notes}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
