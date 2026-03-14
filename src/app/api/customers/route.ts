import { NextRequest, NextResponse } from "next/server";
import { requireAppUserFromRequest } from "@/lib/auth/request-user";
import { jsonServerError } from "@/lib/api/route-errors";
import { createCustomer, listCustomers } from "@/lib/repositories/customers";
import { parseCreateCustomerPayload } from "@/lib/validations/customer";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const customers = await listCustomers(supabase);
    return NextResponse.json({ data: customers });
  } catch (error) {
    return jsonServerError(error, "Failed to load customers");
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = parseCreateCustomerPayload(await request.json());
    const { supabase } = await requireAppUserFromRequest(request, [
      "admin",
      "dispatcher",
    ]);
    const customer = await createCustomer(supabase, payload);
    return NextResponse.json({ data: customer }, { status: 201 });
  } catch (error) {
    return jsonServerError(error, "Failed to create customer");
  }
}
