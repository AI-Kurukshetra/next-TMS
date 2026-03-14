import { NextResponse } from "next/server";
import { isMissingSchemaError } from "@/lib/supabase/schema-errors";

export class ApiRouteError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRouteError";
    this.status = status;
  }
}

export function jsonServerError(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiRouteError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (isMissingSchemaError(error)) {
    return NextResponse.json(
      { error: error.message, missingTable: error.tableName },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : fallbackMessage,
    },
    { status: 500 },
  );
}
