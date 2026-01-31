"use client";

import Link from "next/link";
import { Home, LayoutGrid, Calendar, GraduationCap, Gift, Store, Shield, LayoutDashboard } from "lucide-react";
import { useBettr } from "@/context/BettrContext";

const nav = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/marketplace", label: "Algorithms", icon: LayoutGrid },
  { href: "/scheduler", label: "Scheduler", icon: Calendar },
  { href: "/curriculum", label: "Curriculum", icon: GraduationCap },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/marketplace/ai", label: "AI & Assets", icon: Store },
  { href: "/verify", label: "Verify", icon: Shield },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Header() {
  const { isVerified } = useBettr();

  return (
    <header className="sticky top-0 z-50 border-b border-bettr-sage/30 bg-bettr-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-bettr-forest">
          <span className="text-xl">Bettr</span>
          {isVerified && (
            <span className="rounded-full bg-bettr-mint px-2 py-0.5 text-xs font-medium text-bettr-forest">
              Verified
            </span>
          )}
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-bettr-navy transition hover:bg-bettr-mint/50"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
