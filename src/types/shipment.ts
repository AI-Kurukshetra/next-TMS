export type ShipmentStatus =
  | "draft"
  | "booked"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type Shipment = {
  id: string;
  shipment_number: string;
  customer_id: string;
  carrier_id: string | null;
  driver_id: string | null;
  vehicle_id: string | null;
  route_id: string | null;
  created_by: string | null;
  origin_location: string;
  destination_location: string;
  status: ShipmentStatus;
  created_at: string;
  updated_at: string;
};

export type ShipmentSummary = {
  id: string;
  shipment_number: string;
  customer_id: string;
  origin_location: string;
  destination_location: string;
  status: ShipmentStatus;
  customer_name: string | null;
  carrier_name: string | null;
  driver_name: string | null;
  vehicle_number: string | null;
  created_at: string;
};

export type TrackingEvent = {
  id: string;
  shipment_id: string;
  event_type: string;
  location: string | null;
  notes: string | null;
  created_at: string;
};

export type ShipmentDetails = ShipmentSummary &
  Shipment & {
    tracking_events: TrackingEvent[];
  };

export type CarrierOption = {
  id: string;
  name: string;
};

export type VehicleOption = {
  id: string;
  vehicle_number: string;
  carrier_id: string;
  status: string;
};

export type DriverOption = {
  id: string;
  full_name: string;
  carrier_id: string;
};
