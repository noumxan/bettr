import { prisma } from "@/lib/db";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CurriculumAdminPage() {
  const [badges, courses] = await Promise.all([
    prisma.badge.findMany({ orderBy: { focusArea: "asc" }, include: { _count: { select: { userBadges: true } } } }),
    prisma.course.findMany({ orderBy: { title: "asc" }, include: { _count: { select: { enrollments: true, topics: true } } } }),
  ]);

  const badgeColumns = [
    { key: "name", header: "Badge" },
    { key: "focusArea", header: "Focus area" },
    { key: "issued", header: "Issued", render: (r: { _count: { userBadges: number } }) => r._count.userBadges },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content + Skills Admin</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage course modules, badges, ESCO skill mapping. Moodle-like course configuration. Completion stats and progression tracking.
          </p>
        </div>
        <AdminDataTable
          title="Badges"
          columns={badgeColumns}
          data={badges}
          emptyMessage="No badges."
        />
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="font-semibold text-slate-900">Courses (Moodle-like)</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {courses.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{c.title}</p>
                  <p className="text-sm text-slate-600">{c._count.enrollments} enrolled · {c._count.topics} topics</p>
                </div>
                <Link href="#" className="text-sm font-medium text-bettr-forest hover:underline">Configure</Link>
              </li>
            ))}
            {courses.length === 0 && (
              <li className="px-4 py-6 text-center text-slate-500">No courses.</li>
            )}
          </ul>
        </div>
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
