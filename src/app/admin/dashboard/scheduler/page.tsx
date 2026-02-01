import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SchedulerPage() {
  const [blocks, count] = await Promise.all([
    prisma.scheduleBlock.findMany({
      include: { algorithm: true, user: { select: { displayName: true, email: true } } },
      orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }],
      take: 100,
    }),
    prisma.scheduleBlock.count(),
  ]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Bounty 3: Algorithmic Productivity and Wellness Scheduler</h1>
      <p className="text-bettr-navy/70">
        Content Curriculum manager. Schedule Vocational Upskilling for weekday mornings, Social Discovery for evening. Cron triggers, Wellness AI. Fights doomscrolling.
      </p>
      <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-bettr-navy/70">Total scheduled feeds</p>
        <p className="text-2xl font-bold text-bettr-forest">{count}</p>
      </div>
      <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold text-bettr-forest">Recent schedule blocks</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bettr-sage/30 text-left">
              <th className="py-2">User</th>
              <th className="py-2">Day</th>
              <th className="py-2">Time</th>
              <th className="py-2">Algorithm</th>
              <th className="py-2">Label</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr key={b.id} className="border-b border-bettr-sage/20">
                <td className="py-2">{b.user.displayName ?? b.user.email ?? b.userId}</td>
                <td className="py-2">{days[b.dayOfWeek]}</td>
                <td className="py-2">{b.startHour}:00–{b.endHour}:00</td>
                <td className="py-2">{b.algorithm.name}</td>
                <td className="py-2">{b.label ?? "—"}</td>
              </tr>
            ))}
            {blocks.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-bettr-navy/60">
                  No schedule blocks. Create via API or student app.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
