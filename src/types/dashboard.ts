import { ShipmentSummary } from "@/types/shipment";
import { TrackingEventRecord } from "@/types/tracking";

export type DashboardMetric = {
  label: string;
  value: number;
};

export type DashboardOverview = {
  metrics: DashboardMetric[];
  recentShipments: ShipmentSummary[];
  recentTrackingEvents: TrackingEventRecord[];
};
