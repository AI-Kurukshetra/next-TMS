import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import { listRecentTrackingEventsForUser } from "@/lib/repositories/tracking";

export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
      "customer",
      "driver",
    ]);
    const events = await listRecentTrackingEventsForUser(supabase, user, 20);
    return NextResponse.json({ data: events });
  } catch (error) {
    return jsonServerError(error, "Failed to load tracking feed");
  }
}
