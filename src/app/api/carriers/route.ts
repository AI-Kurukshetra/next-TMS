import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import {
  createCarrier,
  listCarriersCatalog,
} from "@/lib/repositories/carriers";
import { getOptionalString, getRequiredString } from "@/lib/validations/shared";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const carriers = await listCarriersCatalog(supabase);
    return NextResponse.json({ data: carriers });
  } catch (error) {
    return jsonServerError(error, "Failed to load carriers");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { supabase } = await requireAppUserFromRequest(request, ["admin"]);
    const carrier = await createCarrier(supabase, {
      companyName: getRequiredString(body.companyName as string, "companyName"),
      contactName: getOptionalString(body.contactName as string),
      email: getOptionalString(body.email as string),
      phone: getOptionalString(body.phone as string),
      mcNumber: getOptionalString(body.mcNumber as string),
      dotNumber: getOptionalString(body.dotNumber as string),
    });

    return NextResponse.json({ data: carrier }, { status: 201 });
  } catch (error) {
    return jsonServerError(error, "Failed to create carrier");
  }
}
