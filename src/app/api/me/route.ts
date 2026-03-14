import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromRequest } from "@/lib/auth/server";
import { isUserRole } from "@/lib/auth/roles";
import { jsonServerError } from "@/lib/api/route-errors";
import {
  getCurrentAppUser,
  syncCurrentAppUser,
} from "@/lib/repositories/users";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient(accessToken);
    const user = await getCurrentAppUser(supabase, accessToken);
    return NextResponse.json({ data: user });
  } catch (error) {
    return jsonServerError(error, "Failed to load current user");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      fullName?: string;
      role?: string;
    };
    const nextRole = body.role && isUserRole(body.role) ? body.role : undefined;

    if (body.role && !isUserRole(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient(accessToken);
    const user = await syncCurrentAppUser(supabase, accessToken, {
      fullName: body.fullName,
      role: nextRole,
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    return jsonServerError(error, "Failed to sync current user");
  }
}
