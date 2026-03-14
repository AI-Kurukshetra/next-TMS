export type TrackingEventType =
  | "created"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "arrived_hub"
  | "reached_destination"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export type TrackingEventRecord = {
  id: string;
  shipment_id: string;
  event_type: TrackingEventType;
  location: string | null;
  notes: string | null;
  created_at: string;
  created_by: string | null;
};

export function isTrackingEventType(value: string): value is TrackingEventType {
  return [
    "created",
    "assigned",
    "picked_up",
    "in_transit",
    "arrived_hub",
    "reached_destination",
    "out_for_delivery",
    "delivered",
    "exception",
  ].includes(value);
}
