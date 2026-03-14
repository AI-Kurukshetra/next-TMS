import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import {
  createShipmentRecord,
  listShipmentsForUser,
} from "@/lib/supabase/queries/shipments";
import { parseCreateShipmentPayload } from "@/lib/validations/shipment";

export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
      "customer",
      "driver",
    ]);
    const shipments = await listShipmentsForUser(supabase, user);
    return NextResponse.json({ data: shipments });
  } catch (error) {
    return jsonServerError(error, "Failed to load shipments");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = parseCreateShipmentPayload(await request.json());
    const { supabase, user } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
      "customer",
    ]);

    const customerId =
      user.role === "customer" ? user.customer_id ?? body.customerId : body.customerId;

    const shipment = await createShipmentRecord(supabase, {
      customerId,
      originLocation: body.originLocation,
      destinationLocation: body.destinationLocation,
      weightKg: body.weightKg,
      createdBy: user.id,
      status: user.role === "customer" ? "draft" : "booked",
      requestLabel:
        user.role === "customer"
          ? "Shipment request created by customer"
          : "Shipment created by dispatcher",
    });

    return NextResponse.json({ data: shipment }, { status: 201 });
  } catch (error) {
    return jsonServerError(error, "Failed to create shipment");
  }
}
