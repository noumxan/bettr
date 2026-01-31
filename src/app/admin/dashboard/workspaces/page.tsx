import { prisma } from "@/lib/db";

export default async function WorkspacesPage() {
  const workspaces = await prisma.workspace.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">University collaboration (shared workspaces)</h1>
      <p className="text-bettr-navy/70">
        Shared workspaces inside the dashboard. Link to universities.
      </p>
      <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold text-bettr-forest">Workspaces</h2>
        <ul className="space-y-2 text-sm">
          {workspaces.map((w) => (
            <li key={w.id} className="flex items-center justify-between rounded border border-bettr-sage/20 px-3 py-2">
              <span className="font-medium text-bettr-navy">{w.name}</span>
              <span className="text-bettr-navy/60">{w._count.members} members</span>
            </li>
          ))}
          {workspaces.length === 0 && (
            <li className="py-4 text-center text-bettr-navy/60">No workspaces yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
