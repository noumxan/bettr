import Link from "next/link";
import { Shield, LayoutGrid, Calendar, Gift, GraduationCap, Bot, TrendingUp, Activity, ExternalLink, Smartphone } from "lucide-react";
import AdminKpiCard from "@/components/admin/AdminKpiCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSection from "@/components/admin/AdminSection";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";
import { getMetrics } from "@/lib/admin-metrics";

export default async function AdminOverviewPage() {
  const m = await getMetrics();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Admin Dashboard"
        description="Operations, analytics, and configuration. Use the preview panel to see the student experience."
      />
      <div className="rounded-xl border border-bettr-forest/20 bg-bettr-forest/5 p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bettr-forest/20 text-bettr-forest">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Student app (main interface)</p>
            <p className="text-sm text-slate-600">Open the Bettr student app in a new tab to test as a user.</p>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-bettr-forest px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
        >
          <ExternalLink className="h-4 w-4" />
          Open app
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Key metrics</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <AdminKpiCard
                title="Verified Students"
                value={m.verifiedStudents}
                icon={Shield}
                trend="Onboarding growth"
              />
              <AdminKpiCard
                title="Active Algorithms"
                value={m.activeAlgorithms}
                icon={LayoutGrid}
                subtitle="Feed ranking models"
              />
              <AdminKpiCard
                title="Scheduled Feeds"
                value={m.scheduledFeeds}
                icon={Calendar}
              />
              <AdminKpiCard
                title="Revenue Distributed"
                value={`${m.payoutTotal} pts`}
                icon={Gift}
                trend="Payout trends"
              />
              <AdminKpiCard
                title="Badges Issued"
                value={m.badgesEarned}
                icon={GraduationCap}
              />
              <AdminKpiCard
                title="AI & Assets"
                value={m.aiAndAssets}
                icon={Bot}
              />
            </div>
          </div>

          <AdminSection
            title="Analytics"
            description="Onboarding growth, algorithm usage, payout trends"
          >
            <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
              <div className="flex flex-col items-center gap-2 text-center">
                <TrendingUp className="h-9 w-9" />
                <span className="text-sm">Charts — integrate your analytics provider</span>
              </div>
            </div>
          </AdminSection>

          <AdminSection
            title="Recent activity"
            description="Latest system events"
          >
            <ul className="divide-y divide-slate-100">
              {[
                { label: "Universities", text: "New institution added to registry", time: "2h ago" },
                { label: "Algorithms", text: "New algorithm approved for feed", time: "5h ago" },
                { label: "Payouts", text: "Batch completed for creator earnings", time: "1d ago" },
                { label: "Badges", text: "Badge issued to verified student", time: "1d ago" },
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-600">{item.text}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </AdminSection>
        </div>

        <div className="lg:col-span-1">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Student preview</h2>
          <AdminPreviewPhoneFrame title="Main app (live)" live />
        </div>
      </div>
    </div>
  );
}
