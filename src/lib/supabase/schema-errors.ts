import { PostgrestError } from "@supabase/supabase-js";

const MISSING_SCHEMA_CODE = "PGRST205";

export class MissingSupabaseSchemaError extends Error {
  tableName: string | null;

  constructor(tableName: string | null) {
    super(
      tableName
        ? `Required Supabase table "${tableName}" is missing. Run database/schema.sql in your Supabase SQL editor.`
        : "Required Supabase tables are missing. Run database/schema.sql in your Supabase SQL editor.",
    );
    this.name = "MissingSupabaseSchemaError";
    this.tableName = tableName;
  }
}

export function formatPostgrestError(error: PostgrestError) {
  const parts = [error.message, error.details, error.hint].filter(
    (value): value is string => Boolean(value),
  );

  return parts.join(" ");
}

export function isMissingSchemaError(
  error: unknown,
): error is MissingSupabaseSchemaError {
  return error instanceof MissingSupabaseSchemaError;
}

export function throwIfSupabaseError(error: PostgrestError | null) {
  if (!error) {
    return;
  }

  if (error.code === MISSING_SCHEMA_CODE) {
    const match = error.message.match(/table '([^']+)'/i);
    throw new MissingSupabaseSchemaError(match?.[1] ?? null);
  }

  throw new Error(formatPostgrestError(error), { cause: error });
}
