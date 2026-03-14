import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import { listAppUsers, updateAppUserAccess } from "@/lib/repositories/users";
import { getOptionalString, getRequiredString } from "@/lib/validations/shared";
import { isUserRole } from "@/lib/auth/roles";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAppUserFromRequest(request, ["admin"]);
    const users = await listAppUsers(supabase);
    return NextResponse.json({ data: users });
  } catch (error) {
    return jsonServerError(error, "Failed to load users");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { supabase } = await requireAppUserFromRequest(request, ["admin"]);
    const body = (await request.json()) as Record<string, unknown>;
    const role = getRequiredString(body.role as string, "role");

    if (!isUserRole(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await updateAppUserAccess(supabase, {
      userId: getRequiredString(body.userId as string, "userId"),
      role,
      carrierId: getOptionalString(body.carrierId as string),
      customerId: getOptionalString(body.customerId as string),
      driverId: getOptionalString(body.driverId as string),
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    return jsonServerError(error, "Failed to update user");
  }
}
