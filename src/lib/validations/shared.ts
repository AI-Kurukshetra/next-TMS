export function getRequiredString(
  value: FormDataEntryValue | string | null | undefined,
  field: string,
) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    throw new Error(`${field} is required`);
  }

  return normalized;
}

export function getOptionalString(
  value: FormDataEntryValue | string | null | undefined,
) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

export function getOptionalNumber(
  value: FormDataEntryValue | string | null | undefined,
) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    throw new Error("Invalid number value");
  }

  return parsed;
}
