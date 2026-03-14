import { SchemaSetupNotice } from "@/components/shipments/schema-setup-notice";
import { PageHeader } from "@/components/ui/page-header";
import { ResourceSection } from "@/components/ui/resource-section";
import { listVehiclesCatalog } from "@/lib/repositories/vehicles";
import { isMissingSchemaError } from "@/lib/supabase/schema-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function VehiclesPage() {
  const supabase = createServerSupabaseClient();

  try {
    const vehicles = await listVehiclesCatalog(supabase);

    return (
      <div className="space-y-8">
        <PageHeader
          title="Vehicles"
          description="Fleet records used for shipment allocation and dispatch."
        />

        <ResourceSection
          title="Fleet"
          description="Vehicle inventory with capacity and operational status."
          rows={vehicles}
          emptyMessage="No vehicles have been created yet."
          columns={[
            {
              header: "Vehicle",
              render: (vehicle) => (
                <span className="font-medium text-slate-900">
                  {vehicle.vehicle_number}
                </span>
              ),
            },
            {
              header: "Carrier",
              render: (vehicle) => vehicle.carrier_id,
            },
            {
              header: "Type",
              render: (vehicle) => vehicle.vehicle_type ?? "-",
            },
            {
              header: "Status",
              render: (vehicle) => vehicle.status,
            },
          ]}
        />
      </div>
    );
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return (
        <div className="space-y-8">
          <PageHeader
            title="Vehicles"
            description="Fleet records used for shipment allocation and dispatch."
          />
          <SchemaSetupNotice tableName={error.tableName} />
        </div>
      );
    }

    throw error;
  }
}
