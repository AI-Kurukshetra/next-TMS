import { getRequiredString } from "@/lib/validations/shared";

export function parseCreateShipmentPayload(payload: Record<string, unknown>) {
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
  };
}
