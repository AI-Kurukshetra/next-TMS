import { SupabaseClient } from "@supabase/supabase-js";
import { DashboardOverview } from "@/types/dashboard";
import {
  listShipments,
  listShipmentsForUser,
} from "@/lib/repositories/shipments";
import {
  listRecentTrackingEvents,
  listRecentTrackingEventsForUser,
} from "@/lib/repositories/tracking";
import { AppUser } from "@/types/user";

export async function getDashboardOverview(
  supabase: SupabaseClient,
): Promise<DashboardOverview> {
  const [recentShipments, recentTrackingEvents] = await Promise.all([
    listShipments(supabase),
    listRecentTrackingEvents(supabase, 8),
  ]);

  return {
    metrics: [
      { label: "Total Shipments", value: recentShipments.length },
      {
        label: "In Transit",
        value: recentShipments.filter(
          (shipment) => shipment.status === "in_transit",
        ).length,
      },
      {
        label: "Delivered",
        value: recentShipments.filter(
          (shipment) => shipment.status === "delivered",
        ).length,
      },
      {
        label: "Needs Dispatch",
        value: recentShipments.filter(
          (shipment) =>
            shipment.status === "draft" ||
            shipment.status === "booked" ||
            shipment.status === "assigned",
        ).length,
      },
    ],
    recentShipments: recentShipments.slice(0, 6),
    recentTrackingEvents,
  };
}

export async function getDashboardOverviewForUser(
  supabase: SupabaseClient,
  user: AppUser,
): Promise<DashboardOverview> {
  const [recentShipments, recentTrackingEvents] = await Promise.all([
    user.role === "admin" || user.role === "dispatcher"
      ? listShipments(supabase)
      : listShipmentsForUser(supabase, user),
    listRecentTrackingEventsForUser(supabase, user, 8),
  ]);

  const delivered = recentShipments.filter(
    (shipment) => shipment.status === "delivered",
  ).length;
  const inTransit = recentShipments.filter(
    (shipment) => shipment.status === "in_transit",
  ).length;

  if (user.role === "customer") {
    return {
      metrics: [
        { label: "Requests", value: recentShipments.length },
        { label: "In Transit", value: inTransit },
        { label: "Delivered", value: delivered },
        {
          label: "Open Requests",
          value: recentShipments.length - delivered,
        },
      ],
      recentShipments: recentShipments.slice(0, 6),
      recentTrackingEvents,
    };
  }

  if (user.role === "driver") {
    return {
      metrics: [
        { label: "Assigned Loads", value: recentShipments.length },
        { label: "In Transit", value: inTransit },
        { label: "Delivered", value: delivered },
        {
          label: "Pending Delivery",
          value: recentShipments.filter(
            (shipment) => shipment.status !== "delivered",
          ).length,
        },
      ],
      recentShipments: recentShipments.slice(0, 6),
      recentTrackingEvents,
    };
  }

  return getDashboardOverview(supabase);
}
