import { SchemaSetupNotice } from "@/components/shipments/schema-setup-notice";
import { PageHeader } from "@/components/ui/page-header";
import { ResourceSection } from "@/components/ui/resource-section";
import { listRoutes } from "@/lib/repositories/routes";
import { isMissingSchemaError } from "@/lib/supabase/schema-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function RoutesPage() {
  const supabase = createServerSupabaseClient();

  try {
    const routes = await listRoutes(supabase);

    return (
      <div className="space-y-8">
        <PageHeader
          title="Routes"
          description="Reusable transport lanes used for planning and pricing."
        />

        <ResourceSection
          title="Route Catalog"
          description="Base route master for shipment planning and rate lookup."
          rows={routes}
          emptyMessage="No routes have been created yet."
          columns={[
            {
              header: "Origin",
              render: (route) => (
                <span className="font-medium text-slate-900">
                  {route.origin_city}
                </span>
              ),
            },
            {
              header: "Destination",
              render: (route) => route.destination_city,
            },
            {
              header: "Distance",
              render: (route) =>
                route.distance_km ? `${route.distance_km} km` : "-",
            },
            {
              header: "ETA",
              render: (route) =>
                route.estimated_hours ? `${route.estimated_hours} hrs` : "-",
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
            title="Routes"
            description="Reusable transport lanes used for planning and pricing."
          />
          <SchemaSetupNotice tableName={error.tableName} />
        </div>
      );
    }

    throw error;
  }
}
