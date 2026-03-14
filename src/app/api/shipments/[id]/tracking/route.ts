import { NextRequest, NextResponse } from "next/server";
import { jsonServerError } from "@/lib/api/route-errors";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { addTrackingEvent } from "@/lib/repositories/shipments";
import { getOptionalString, getRequiredString } from "@/lib/validations/shared";
import { isTrackingEventType } from "@/types/tracking";

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
      "driver",
    ]);
    const eventType = getRequiredString(body.eventType as string, "eventType");
    const event = await addTrackingEvent(supabase, {
      shipmentId: id,
      eventType: isTrackingEventType(eventType) ? eventType : "in_transit",
      location: getOptionalString(body.location as string) ?? undefined,
      notes: getOptionalString(body.notes as string) ?? undefined,
      createdBy: user.id,
    });

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error) {
    return jsonServerError(error, "Failed to add tracking event");
  }
}
