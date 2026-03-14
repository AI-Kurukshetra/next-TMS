import { ReactNode } from "react";

type ResourceColumn<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

export function ResourceSection<T>({
  title,
  description,
  rows,
  columns,
  emptyMessage,
}: {
  title: string;
  description: string;
  rows: T[];
  columns: ResourceColumn<T>[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      {!rows.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                {columns.map((column) => (
                  <th key={column.header} className="px-4 py-3">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm">
              {rows.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.header} className="px-4 py-3 text-slate-600">
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
