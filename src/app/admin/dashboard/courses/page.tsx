import { prisma } from "@/lib/db";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { enrollments: true, topics: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Courses (Moodle-like)</h1>
      <p className="text-bettr-navy/70">
        Course management. Social algorithm scheduling can be tied to course topics.
      </p>
      <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold text-bettr-forest">Courses</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((c) => (
            <div key={c.id} className="rounded-lg border border-bettr-sage/20 bg-bettr-cream/50 p-3">
              <p className="font-medium text-bettr-navy">{c.title}</p>
              <p className="text-sm text-bettr-navy/70">{c.description ?? "—"}</p>
              <p className="text-xs text-bettr-navy/60">
                Type: {c.type} · {c._count.enrollments} enrolled · {c._count.topics} topics
              </p>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="col-span-full py-4 text-center text-bettr-navy/60">No courses. Create via API.</p>
          )}
        </div>
      </div>
    </div>
  );
}
