import Link from "next/link";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function AdminPageHeader({ title, description, breadcrumb }: AdminPageHeaderProps) {
  return (
    <header className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="hover:text-bettr-forest transition">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-700">{item.label}</span>
              )}
              {i < breadcrumb.length - 1 && (
                <span className="text-slate-300">/</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600">{description}</p>
      )}
    </header>
  );
}
