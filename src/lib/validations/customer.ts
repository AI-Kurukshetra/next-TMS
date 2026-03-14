import { getOptionalString, getRequiredString } from "@/lib/validations/shared";

export function parseCreateCustomerPayload(payload: Record<string, unknown>) {
  return {
    companyName: getRequiredString(payload.companyName as string, "companyName"),
    contactName: getOptionalString(payload.contactName as string),
    email: getOptionalString(payload.email as string),
    phone: getOptionalString(payload.phone as string),
    billingAddress: getOptionalString(payload.billingAddress as string),
  };
}
