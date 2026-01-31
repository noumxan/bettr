import BettrFeed from "@/components/BettrFeed";
import AlgorithmSidePanel from "@/components/AlgorithmSidePanel";
import HomeSummary from "@/components/HomeSummary";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="flex-1 min-w-0">
          <BettrFeed />
        </div>
        <AlgorithmSidePanel />
      </div>
      <HomeSummary />
    </div>
  );
}
