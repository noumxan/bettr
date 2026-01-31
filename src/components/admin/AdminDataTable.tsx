interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminDataTableProps<T extends Record<string, unknown>> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function AdminDataTable<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  emptyMessage = "No data",
}: AdminDataTableProps<T>) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {title && (
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-3">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-5 py-3.5 text-slate-800">
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
