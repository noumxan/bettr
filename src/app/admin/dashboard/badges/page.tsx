import { listBadges, getLeaderboard } from "@/lib/services/badges";

export default async function BadgesPage() {
  const [badges, leaderboard] = await Promise.all([listBadges(), getLeaderboard(10)]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Bounty 5: The Curriculum of Content — Gamified Education</h1>
      <p className="text-bettr-navy/70">
        Open Badges v3, W3C Verifiable Credentials, ESCO skill mapping. Points, achievements, leaderboard.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">Badge definitions</p>
          <p className="text-2xl font-bold text-bettr-forest">{badges.length}</p>
        </div>
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-bettr-navy/70">Badges earned (total)</p>
          <p className="text-2xl font-bold text-bettr-forest">
            {badges.reduce((s, b) => s + b._count.userBadges, 0)}
          </p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold text-bettr-forest">Badges</h2>
          <ul className="space-y-2 text-sm">
            {badges.map((b) => (
              <li key={b.id} className="flex justify-between rounded border border-bettr-sage/20 px-3 py-2">
                <span className="font-medium text-bettr-navy">{b.name}</span>
                <span className="text-bettr-navy/60">{b.focusArea} · {b._count.userBadges} earned</span>
              </li>
            ))}
            {badges.length === 0 && <li className="text-bettr-navy/60">No badges. Run seed.</li>}
          </ul>
        </div>
        <div className="rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold text-bettr-forest">Leaderboard</h2>
          <ul className="space-y-2 text-sm">
            {leaderboard.map((l, i) => (
              <li key={l.userId} className="flex items-center justify-between rounded border border-bettr-sage/20 px-3 py-2">
                <span className="font-medium text-bettr-navy">
                  #{i + 1} {l.user?.displayName ?? l.user?.email ?? l.userId.slice(0, 8)}
                </span>
                <span className="text-bettr-forest">{l.badgeCount} badges</span>
              </li>
            ))}
            {leaderboard.length === 0 && <li className="text-bettr-navy/60">No leaderboard data yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
