import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import { createDriver, listDrivers } from "@/lib/repositories/drivers";
import { getOptionalString, getRequiredString } from "@/lib/validations/shared";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const drivers = await listDrivers(supabase);
    return NextResponse.json({ data: drivers });
  } catch (error) {
    return jsonServerError(error, "Failed to load drivers");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const driver = await createDriver(supabase, {
      carrierId: getRequiredString(body.carrierId as string, "carrierId"),
      fullName: getRequiredString(body.fullName as string, "fullName"),
      phone: getOptionalString(body.phone as string),
      licenseNumber: getOptionalString(body.licenseNumber as string),
    });

    return NextResponse.json({ data: driver }, { status: 201 });
  } catch (error) {
    return jsonServerError(error, "Failed to create driver");
  }
}
