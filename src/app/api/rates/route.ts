import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import { createRate, listRates } from "@/lib/repositories/rates";
import {
  getOptionalNumber,
  getOptionalString,
  getRequiredString,
} from "@/lib/validations/shared";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const rates = await listRates(supabase);
    return NextResponse.json({ data: rates });
  } catch (error) {
    return jsonServerError(error, "Failed to load rates");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const rate = await createRate(supabase, {
      routeId: getRequiredString(body.routeId as string, "routeId"),
      carrierId: getOptionalString(body.carrierId as string),
      vehicleType: getOptionalString(body.vehicleType as string),
      baseRate: Number(getRequiredString(body.baseRate as string, "baseRate")),
      ratePerKm: getOptionalNumber(body.ratePerKm as string),
      currency: getOptionalString(body.currency as string) ?? "INR",
    });

    return NextResponse.json({ data: rate }, { status: 201 });
  } catch (error) {
    return jsonServerError(error, "Failed to create rate");
  }
}
