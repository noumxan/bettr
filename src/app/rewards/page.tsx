import RewardsDashboard from "@/components/RewardsDashboard";

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bettr-forest">Rewards & Compensation</h1>
        <p className="mt-1 text-bettr-navy/70">
          Earn points for completing scheduled blocks and engaging with positive content. Crypto, Solana Pay, ZKP logic explained but not executed.
        </p>
      </div>
      <RewardsDashboard />
    </div>
  );
}
