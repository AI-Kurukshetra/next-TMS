import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import { getDashboardOverviewForUser } from "@/lib/repositories/dashboard";

export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireAppUserFromRequest(request);
    const overview = await getDashboardOverviewForUser(supabase, user);
    return NextResponse.json({ data: overview });
  } catch (error) {
    return jsonServerError(error, "Failed to load dashboard");
  }
}
