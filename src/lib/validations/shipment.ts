import { getOptionalNumber, getRequiredString } from "@/lib/validations/shared";

export function parseCreateShipmentPayload(payload: Record<string, unknown>) {
  const weightKg = getOptionalNumber(payload.weightKg as string);

  if (weightKg !== null && weightKg <= 0) {
    throw new Error("weightKg must be greater than 0");
  }

  return {
    customerId: getRequiredString(payload.customerId as string, "customerId"),
    originLocation: getRequiredString(
      payload.originLocation as string,
      "originLocation",
    ),
    destinationLocation: getRequiredString(
      payload.destinationLocation as string,
      "destinationLocation",
    ),
    weightKg,
  };
}
