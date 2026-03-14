import { ShipmentStatus } from "@/types/shipment";
import { cn } from "@/lib/utils/cn";

const statusStyles: Record<ShipmentStatus, string> = {
  draft: "bg-slate-200 text-slate-700",
  booked: "bg-amber-100 text-amber-800",
  assigned: "bg-sky-100 text-sky-800",
  in_transit: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        statusStyles[status],
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
