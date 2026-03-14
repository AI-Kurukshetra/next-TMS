import { SupabaseClient } from "@supabase/supabase-js";
import { listShipmentsForUser } from "@/lib/repositories/shipments";
import { throwIfSupabaseError } from "@/lib/supabase/schema-errors";
import { TrackingEventRecord } from "@/types/tracking";
import { AppUser } from "@/types/user";

export async function listRecentTrackingEvents(
  supabase: SupabaseClient,
  limit = 10,
): Promise<TrackingEventRecord[]> {
  const { data, error } = await supabase
    .from("tracking_events")
    .select("id, shipment_id, event_type, location, notes, created_at, created_by")
    .order("created_at", { ascending: false })
    .limit(limit);

  throwIfSupabaseError(error);
  return (data ?? []) as TrackingEventRecord[];
}

export async function listRecentTrackingEventsForUser(
  supabase: SupabaseClient,
  user: AppUser,
  limit = 10,
): Promise<TrackingEventRecord[]> {
  if (user.role === "admin" || user.role === "dispatcher") {
    return listRecentTrackingEvents(supabase, limit);
  }

  const shipments = await listShipmentsForUser(supabase, user);
  const shipmentIds = shipments.map((shipment) => shipment.id);

  if (!shipmentIds.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("tracking_events")
    .select("id, shipment_id, event_type, location, notes, created_at, created_by")
    .in("shipment_id", shipmentIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  throwIfSupabaseError(error);
  return (data ?? []) as TrackingEventRecord[];
}
