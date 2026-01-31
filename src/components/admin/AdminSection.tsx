import { ReactNode } from "react";

interface AdminSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function AdminSection({
  title,
  description,
  action,
  children,
  className = "",
}: AdminSectionProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-600">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="p-5 pt-4">{children}</div>
    </section>
  );
}
