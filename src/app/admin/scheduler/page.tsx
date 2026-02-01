import { prisma } from "@/lib/db";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";
import { Calendar, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function AdminSchedulerPage() {
  const blocks = await prisma.scheduleBlock.findMany({
    include: { algorithm: true, user: { select: { displayName: true, email: true } } },
    orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }],
    take: 50,
  });

  const columns = [
    { key: "user", header: "User", render: (r: { user: { displayName: string | null; email: string | null }; userId: string }) => r.user?.displayName ?? r.user?.email ?? r.userId.slice(0, 8) },
    { key: "day", header: "Day", render: (r: { dayOfWeek: number }) => DAYS[r.dayOfWeek] },
    { key: "time", header: "Time", render: (r: { startHour: number; endHour: number }) => `${r.startHour}:00 – ${r.endHour}:00` },
    { key: "algorithm", header: "Algorithm", render: (r: { algorithm: { name: string } }) => r.algorithm.name },
    { key: "label", header: "Label" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Scheduler</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage scheduling templates (Morning Focus, Evening Social). View active cron jobs and upcoming switches.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-bettr-forest" />
              <span className="font-semibold text-slate-900">Templates</span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Morning Focus — Study algorithm 9–12</li>
              <li>Evening Social — Social algorithm 19–22</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-bettr-forest" />
              <span className="font-semibold text-slate-900">Cron & switches</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">Active cron-based triggers for algorithm switching. Upcoming switches listed in table.</p>
          </div>
        </div>
        <AdminDataTable
          title="Schedule blocks"
          columns={columns}
          data={blocks}
          emptyMessage="No schedule blocks."
        />
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
