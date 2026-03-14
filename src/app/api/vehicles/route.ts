import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import {
  createVehicle,
  listVehiclesCatalog,
} from "@/lib/repositories/vehicles";
import {
  getOptionalNumber,
  getOptionalString,
  getRequiredString,
} from "@/lib/validations/shared";
import { VehicleStatus } from "@/types/vehicle";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const vehicles = await listVehiclesCatalog(supabase);
    return NextResponse.json({ data: vehicles });
  } catch (error) {
    return jsonServerError(error, "Failed to load vehicles");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const vehicle = await createVehicle(supabase, {
      carrierId: getRequiredString(body.carrierId as string, "carrierId"),
      driverId: getOptionalString(body.driverId as string),
      vehicleNumber: getRequiredString(
        body.vehicleNumber as string,
        "vehicleNumber",
      ),
      vehicleType: getOptionalString(body.vehicleType as string),
      capacityKg: getOptionalNumber(body.capacityKg as string),
      status: (getOptionalString(body.status as string) as VehicleStatus | null) ??
        "available",
    });

    return NextResponse.json({ data: vehicle }, { status: 201 });
  } catch (error) {
    return jsonServerError(error, "Failed to create vehicle");
  }
}
