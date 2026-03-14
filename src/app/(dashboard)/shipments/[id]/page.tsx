import { ShipmentDetailsShell } from "@/components/shipments/shipment-details-shell";

export default async function ShipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentDetailsShell shipmentId={id} />;
}
