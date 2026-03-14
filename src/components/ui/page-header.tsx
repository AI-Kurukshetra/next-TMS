export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-slate-600">{description}</p>
    </section>
  );
}
