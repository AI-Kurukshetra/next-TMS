import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import { createRoute, listRoutes } from "@/lib/repositories/routes";
import {
  getOptionalNumber,
  getRequiredString,
} from "@/lib/validations/shared";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const routes = await listRoutes(supabase);
    return NextResponse.json({ data: routes });
  } catch (error) {
    return jsonServerError(error, "Failed to load routes");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const routeRecord = await createRoute(supabase, {
      originCity: getRequiredString(body.originCity as string, "originCity"),
      destinationCity: getRequiredString(
        body.destinationCity as string,
        "destinationCity",
      ),
      distanceKm: getOptionalNumber(body.distanceKm as string),
      estimatedHours: getOptionalNumber(body.estimatedHours as string),
    });

    return NextResponse.json({ data: routeRecord }, { status: 201 });
  } catch (error) {
    return jsonServerError(error, "Failed to create route");
  }
}
