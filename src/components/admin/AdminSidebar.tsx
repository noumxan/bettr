"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shield,
  LayoutGrid,
  Calendar,
  GraduationCap,
  Gift,
  Bot,
  Users,
  Settings,
  Languages,
  Trophy,
  Smartphone,
} from "lucide-react";

const overview = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/", label: "View app", icon: Smartphone },
];

const bounties = [
  { href: "/admin/dashboard/identity", label: "Bounty 1: Institutional Identity", icon: Shield },
  { href: "/admin/dashboard/algorithms", label: "Bounty 2: Algorithm Marketplace", icon: LayoutGrid },
  { href: "/admin/dashboard/scheduler", label: "Bounty 3: Content Curriculum Scheduler", icon: Calendar },
  { href: "/admin/dashboard/monetization", label: "Bounty 4: Monetization Engine", icon: Gift },
  { href: "/admin/dashboard/badges", label: "Bounty 5: Curriculum of Content", icon: Trophy },
  { href: "/admin/dashboard/ai-assets", label: "Bounty 6: AI & Digital Asset Hub", icon: Bot },
  { href: "/admin/dashboard/courses", label: "Courses (Moodle)", icon: GraduationCap },
  { href: "/admin/dashboard/workspaces", label: "University collab", icon: Users },
  { href: "/admin/dashboard/language-courses", label: "Language courses", icon: Languages },
];

const operations = [
  { href: "/admin/verify", label: "Student onboarding", icon: Shield },
  { href: "/admin/marketplace", label: "Algorithm marketplace", icon: LayoutGrid },
  { href: "/admin/scheduler", label: "Scheduler", icon: Calendar },
  { href: "/admin/curriculum", label: "Curriculum", icon: GraduationCap },
  { href: "/admin/rewards", label: "Rewards & payouts", icon: Gift },
  { href: "/admin/marketplace/ai", label: "AI assets", icon: Bot },
  { href: "/admin/collaboration", label: "Collaboration", icon: Users },
  { href: "/admin/language-courses", label: "Language courses", icon: Languages },
];

const config = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: typeof overview;
  pathname: string;
}) {
  return (
    <div className="py-2">
      <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">
        {items.map(({ href, label: itemLabel, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-bettr-forest/10 text-bettr-forest"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              {itemLabel}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-slate-200 bg-white">
      <div className="flex h-14 items-center border-b border-slate-200 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bettr-forest text-white text-sm font-bold">
            B
          </span>
          Bettr Admin
        </Link>
      </div>
      <nav className="overflow-y-auto py-3 px-2" style={{ height: "calc(100vh - 3.5rem)" }}>
        <NavGroup label="Overview" items={overview} pathname={pathname} />
        <NavGroup label="Bounties" items={bounties} pathname={pathname} />
        <NavGroup label="Operations" items={operations} pathname={pathname} />
        <NavGroup label="Configuration" items={config} pathname={pathname} />
      </nav>
    </aside>
  );
}
