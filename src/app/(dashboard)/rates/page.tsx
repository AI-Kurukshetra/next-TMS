import { SchemaSetupNotice } from "@/components/shipments/schema-setup-notice";
import { PageHeader } from "@/components/ui/page-header";
import { ResourceSection } from "@/components/ui/resource-section";
import { listRates } from "@/lib/repositories/rates";
import { isMissingSchemaError } from "@/lib/supabase/schema-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function RatesPage() {
  const supabase = createServerSupabaseClient();

  try {
    const rates = await listRates(supabase);

    return (
      <div className="space-y-8">
        <PageHeader
          title="Rates"
          description="Lane and carrier pricing used during shipment booking."
        />

        <ResourceSection
          title="Rate Cards"
          description="Basic route-based pricing records for the MVP."
          rows={rates}
          emptyMessage="No rates have been created yet."
          columns={[
            {
              header: "Route",
              render: (rate) => rate.route_id,
            },
            {
              header: "Carrier",
              render: (rate) => rate.carrier_id ?? "Generic",
            },
            {
              header: "Base Rate",
              render: (rate) => `${rate.currency} ${rate.base_rate}`,
            },
            {
              header: "Per Km",
              render: (rate) =>
                rate.rate_per_km ? `${rate.currency} ${rate.rate_per_km}` : "-",
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
            title="Rates"
            description="Lane and carrier pricing used during shipment booking."
          />
          <SchemaSetupNotice tableName={error.tableName} />
        </div>
      );
    }

    throw error;
  }
}
