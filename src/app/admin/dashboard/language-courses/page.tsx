import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LanguageCoursesPage() {
  const courses = await prisma.course.findMany({
    where: { type: "language" },
    orderBy: { title: "asc" },
    include: { _count: { select: { enrollments: true, topics: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Language courses (Duolingo-style)</h1>
      <p className="text-bettr-navy/70">
        Duolingo-style language course templates. Accessible in backend dashboard.
      </p>
      <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold text-bettr-forest">Language courses</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((c) => (
            <div key={c.id} className="rounded-lg border border-bettr-sage/20 bg-bettr-cream/50 p-3">
              <p className="font-medium text-bettr-navy">{c.title}</p>
              <p className="text-sm text-bettr-navy/70">{c.description ?? "—"}</p>
              <p className="text-xs text-bettr-navy/60">{c._count.enrollments} enrolled · {c._count.topics} topics</p>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="col-span-full py-4 text-center text-bettr-navy/60">
              No language courses. Create courses with type &quot;language&quot; via API.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
