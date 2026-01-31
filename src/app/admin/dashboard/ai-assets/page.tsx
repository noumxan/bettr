import { prisma } from "@/lib/db";

export default async function AIAssetsPage() {
  const [assistants, assets] = await Promise.all([
    prisma.aIAssistant.findMany({ orderBy: { name: "asc" } }),
    prisma.digitalAsset.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Bounty 6: AI Assistant & Digital Asset Hub</h1>
      <p className="text-bettr-navy/70">
        Academic Mentor, Exam Prep, Nutrition. Creator-made digital fashion. Metaplex DAS / MPL Core, LangGraph/CrewAI, SPL-404. Curriculum rewards (Bounty 5) visible here for users.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">AI Assistants</p>
          <p className="text-2xl font-bold text-bettr-forest">{assistants.length}</p>
        </div>
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">Digital assets</p>
          <p className="text-2xl font-bold text-bettr-forest">{assets.length}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold text-bettr-forest">AI Assistants</h2>
          <ul className="space-y-2 text-sm">
            {assistants.map((a) => (
              <li key={a.id} className="rounded border border-bettr-sage/20 p-3">
                <p className="font-medium text-bettr-navy">{a.name}</p>
                <p className="text-bettr-navy/70">{a.description}</p>
                <p className="text-xs text-bettr-navy/60">Skill: {a.skillFocus} · {a.pricing ?? "—"}</p>
              </li>
            ))}
            {assistants.length === 0 && <li className="text-bettr-navy/60">No AI assistants. Run seed.</li>}
          </ul>
        </div>
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold text-bettr-forest">Digital assets</h2>
          <ul className="space-y-2 text-sm">
            {assets.map((a) => (
              <li key={a.id} className="rounded border border-bettr-sage/20 p-3">
                <p className="font-medium text-bettr-navy">{a.name}</p>
                <p className="text-xs text-bettr-navy/60">Type: {a.type}</p>
                {a.metaplexUri && <p className="font-mono text-xs text-bettr-forest">MPL: {a.metaplexUri.slice(0, 40)}…</p>}
              </li>
            ))}
            {assets.length === 0 && <li className="text-bettr-navy/60">No digital assets. Run seed.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
