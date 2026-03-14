type SchemaSetupNoticeProps = {
  tableName?: string | null;
};

export function SchemaSetupNotice({
  tableName,
}: SchemaSetupNoticeProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-amber-950">
            Supabase schema is not set up
          </h2>
          <p className="mt-1 text-sm text-amber-900">
            {tableName
              ? `The app could not find ${tableName} in your Supabase project.`
              : "The app could not find the required tables in your Supabase project."}{" "}
            Run <code>database/schema.sql</code> in the Supabase SQL editor, then
            refresh this page.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-white/70 p-4 text-sm text-amber-950">
          <p className="font-medium">Expected setup</p>
          <p className="mt-1">
            This dashboard needs the <code>shipments</code>, <code>tracking_events</code>,{" "}
            <code>carriers</code>, and <code>vehicles</code> tables before it can load
            or create shipments.
          </p>
        </div>
      </div>
    </section>
  );
}
