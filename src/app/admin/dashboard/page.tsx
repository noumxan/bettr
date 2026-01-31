import Link from "next/link";
import { Shield, LayoutGrid, Calendar, Gift, GraduationCap, Bot } from "lucide-react";
import { prisma } from "@/lib/db";

const bountyCards = [
  { href: "/dashboard/identity", label: "Verified students", icon: Shield, color: "bg-bettr-mint" },
  { href: "/dashboard/algorithms", label: "Active algorithms", icon: LayoutGrid, color: "bg-bettr-sage" },
  { href: "/dashboard/scheduler", label: "Scheduled feeds", icon: Calendar, color: "bg-bettr-forest/20" },
  { href: "/dashboard/monetization", label: "Payout total", icon: Gift, color: "bg-bettr-coral/50" },
  { href: "/dashboard/badges", label: "Badges earned", icon: GraduationCap, color: "bg-bettr-mint/50" },
  { href: "/dashboard/ai-assets", label: "AI & assets", icon: Bot, color: "bg-bettr-navy/10" },
];

async function getMetrics() {
  try {
    const [verifiedCount, algorithmCount, scheduleCount, rewardSum, badgeCount, aiCount] =
      await Promise.all([
        prisma.user.count({ where: { isVerified: true } }),
        prisma.algorithm.count(),
        prisma.scheduleBlock.count(),
        prisma.rewardEntry.aggregate({ _sum: { points: true } }),
        prisma.userBadge.count(),
        prisma.aIAssistant.count() + prisma.digitalAsset.count(),
      ]);
    return {
      verifiedStudents: verifiedCount,
      activeAlgorithms: algorithmCount,
      scheduledFeeds: scheduleCount,
      payoutTotal: rewardSum._sum.points ?? 0,
      badgesEarned: badgeCount,
      aiAndAssets: aiCount,
    };
  } catch {
    return {
      verifiedStudents: 0,
      activeAlgorithms: 0,
      scheduledFeeds: 0,
      payoutTotal: 0,
      badgesEarned: 0,
      aiAndAssets: 0,
    };
  }
}

export default async function DashboardPage() {
  const m = await getMetrics();

  const values = [
    m.verifiedStudents,
    m.activeAlgorithms,
    m.scheduledFeeds,
    m.payoutTotal,
    m.badgesEarned,
    m.aiAndAssets,
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bettr-forest">Bounties overview</h1>
      <p className="text-bettr-navy/70">
        Backend dashboard — metrics by bounty. All data from DB.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bountyCards.map((card, i) => {
          const Icon = card.icon;
          return (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-center gap-4 rounded-xl border border-bettr-sage/30 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${card.color} text-bettr-forest`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-bettr-navy/70">{card.label}</p>
              <p className="text-2xl font-bold text-bettr-forest">{values[i]}</p>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
