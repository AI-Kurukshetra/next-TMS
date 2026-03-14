import { NextRequest, NextResponse } from "next/server";
import { ApiRouteError, jsonServerError } from "@/lib/api/route-errors";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { assignShipmentResources } from "@/lib/repositories/shipments";
import { getRequiredString } from "@/lib/validations/shared";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const { supabase, user } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);

    if (!body.driverId) {
      throw new ApiRouteError("driverId is required", 400);
    }

    const shipment = await assignShipmentResources(supabase, {
      shipmentId: id,
      carrierId: getRequiredString(body.carrierId as string, "carrierId"),
      vehicleId: getRequiredString(body.vehicleId as string, "vehicleId"),
      driverId: getRequiredString(body.driverId as string, "driverId"),
      updatedBy: user.id,
    });

    return NextResponse.json({ data: shipment });
  } catch (error) {
    return jsonServerError(error, "Failed to assign shipment");
  }
}
