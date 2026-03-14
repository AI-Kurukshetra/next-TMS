import { SchemaSetupNotice } from "@/components/shipments/schema-setup-notice";
import { PageHeader } from "@/components/ui/page-header";
import { ResourceSection } from "@/components/ui/resource-section";
import { listCustomers } from "@/lib/repositories/customers";
import { isMissingSchemaError } from "@/lib/supabase/schema-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CustomersPage() {
  const supabase = createServerSupabaseClient();

  try {
    const customers = await listCustomers(supabase);

    return (
      <div className="space-y-8">
        <PageHeader
          title="Customers"
          description="Shippers and consignees linked to shipment bookings."
        />

        <ResourceSection
          title="Customer Directory"
          description="Basic customer master data for shipment creation."
          rows={customers}
          emptyMessage="No customers have been created yet."
          columns={[
            {
              header: "Company",
              render: (customer) => (
                <span className="font-medium text-slate-900">
                  {customer.company_name}
                </span>
              ),
            },
            {
              header: "Contact",
              render: (customer) => customer.contact_name ?? "-",
            },
            {
              header: "Email",
              render: (customer) => customer.email ?? "-",
            },
            {
              header: "Phone",
              render: (customer) => customer.phone ?? "-",
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
            title="Customers"
            description="Shippers and consignees linked to shipment bookings."
          />
          <SchemaSetupNotice tableName={error.tableName} />
        </div>
      );
    }

    throw error;
  }
}
