"use client";

import Link from "next/link";
import { Search, Bell, Send, User, ExternalLink } from "lucide-react";

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-6 border-b border-slate-200 bg-white px-6">
      <div className="flex flex-1 items-center gap-4 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search operations, config..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-200 transition"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
            title="Quick actions"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-bettr-forest hover:bg-bettr-forest/10 transition"
        >
          <ExternalLink className="h-4 w-4" />
          Main app
        </Link>
        <span className="text-sm text-slate-500">Admin</span>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-bettr-forest text-white hover:opacity-90 transition"
          title="Profile"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
