import { prisma } from "@/lib/db";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPreviewPhoneFrame from "@/components/admin/AdminPreviewPhoneFrame";

export const dynamic = "force-dynamic";

export default async function LanguageCoursesAdminPage() {
  const courses = await prisma.course.findMany({
    where: { type: "language" },
    orderBy: { title: "asc" },
    include: { _count: { select: { enrollments: true, topics: true } } },
  });

  const columns = [
    { key: "title", header: "Course" },
    { key: "enrollments", header: "Enrolled" },
    { key: "topics", header: "Topics" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Duolingo-Style Language Courses</h1>
          <p className="mt-1 text-sm text-slate-600">
            Admin templates for language tracks. Progress tracking, streak metrics, reward assignments.
          </p>
        </div>
        <AdminDataTable
          title="Language courses"
          columns={columns}
          data={courses.map((c) => ({ ...c, enrollments: c._count.enrollments, topics: c._count.topics }))}
          emptyMessage="No language courses. Create with type 'language'."
        />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Templates</h3>
          <p className="mt-1 text-sm text-slate-600">
            Duolingo-style templates: lessons, streaks, XP, and reward assignments per language track.
          </p>
        </div>
      </div>
      <div>
        <AdminPreviewPhoneFrame title="Main app (live)" live />
      </div>
    </div>
  );
}
