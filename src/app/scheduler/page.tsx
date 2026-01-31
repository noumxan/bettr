import SchedulerCalendar from "@/components/SchedulerCalendar";

export default function SchedulerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bettr-forest">Scheduled Content Controls</h1>
        <p className="mt-1 text-bettr-navy/70">
          Assign algorithms to time blocks and days. Feed switches automatically based on schedule (simulated). Combat doomscrolling and support focus.
        </p>
      </div>
      <SchedulerCalendar />
    </div>
  );
}
