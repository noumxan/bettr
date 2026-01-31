import CurriculumWidgets from "@/components/CurriculumWidgets";

export default function CurriculumPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bettr-forest">Curriculum of Content</h1>
        <p className="mt-1 text-bettr-navy/70">
          Content tagged by focus areas. Progress indicators and badges are visual only (no real credential issuance).
        </p>
      </div>
      <CurriculumWidgets />
    </div>
  );
}
