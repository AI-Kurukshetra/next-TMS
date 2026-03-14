import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { ApiRouteError } from "@/lib/api/route-errors";
import { jsonServerError } from "@/lib/api/route-errors";
import {
  addTrackingEvent,
  assignShipmentResources,
  getShipmentByIdForUser,
  updateShipmentStatus,
} from "@/lib/supabase/queries/shipments";
import { getDriverByUserId } from "@/lib/repositories/drivers";
import { isTrackingEventType } from "@/types/tracking";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, user } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
      "customer",
      "driver",
    ]);
    const shipment = await getShipmentByIdForUser(supabase, user, id);

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    return NextResponse.json({ data: shipment });
  } catch (error) {
    return jsonServerError(error, "Failed to load shipment");
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { supabase, user } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
      "driver",
      "customer",
    ]);
    const shipment = await getShipmentByIdForUser(supabase, user, id);

    if (!shipment) {
      throw new ApiRouteError("Shipment not found", 404);
    }

    if (body.action === "assign") {
      if (user.role !== "admin" && user.role !== "dispatcher") {
        throw new ApiRouteError("Forbidden", 403);
      }

      const assignedShipment = await assignShipmentResources(supabase, {
        shipmentId: id,
        carrierId: String(body.carrierId),
        vehicleId: String(body.vehicleId),
        driverId: String(body.driverId),
        updatedBy: user.id,
      });

      return NextResponse.json({ data: assignedShipment });
    }

    if (body.action === "status") {
      if (user.role === "customer") {
        throw new ApiRouteError("Forbidden", 403);
      }

      if (user.role === "driver") {
        const driver = await getDriverByUserId(supabase, user.id);

        if (!driver || shipment.driver_id !== driver.id) {
          throw new ApiRouteError("Forbidden", 403);
        }
      }

      const updatedShipment = await updateShipmentStatus(supabase, {
        shipmentId: id,
        status: body.status,
        location: body.location,
        eventType:
          typeof body.eventType === "string" && isTrackingEventType(body.eventType)
            ? body.eventType
            : undefined,
        notes: body.notes,
        updatedBy: user.id,
      });

      return NextResponse.json({ data: updatedShipment });
    }

    if (body.action === "tracking") {
      if (user.role === "customer") {
        throw new ApiRouteError("Forbidden", 403);
      }

      const event = await addTrackingEvent(supabase, {
        shipmentId: id,
        eventType:
          typeof body.eventType === "string" && isTrackingEventType(body.eventType)
            ? body.eventType
            : "in_transit",
        location: body.location ? String(body.location) : undefined,
        notes: body.notes ? String(body.notes) : undefined,
        createdBy: user.id,
      });

      return NextResponse.json({ data: event }, { status: 201 });
    }

    return NextResponse.json(
      { error: "Unsupported action" },
      { status: 400 },
    );
  } catch (error) {
    return jsonServerError(error, "Failed to update shipment");
  }
}
