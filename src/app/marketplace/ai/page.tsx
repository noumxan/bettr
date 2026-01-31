import Link from "next/link";

const ASSISTANTS = [
  { id: "academic", name: "Academic Mentor", desc: "Study tips, deadlines, and resource suggestions." },
  { id: "wellness", name: "Wellness Coach", desc: "Mindfulness and mental health support." },
  { id: "career", name: "Career Assistant", desc: "Resume, interviews, and job market insights." },
  { id: "nutrition", name: "Nutrition Assistant", desc: "Healthy eating and meal planning." },
];

const ASSETS = [
  { id: "skin-1", name: "Creator Skin: Forest", desc: "Profile theme and accent." },
  { id: "fashion-1", name: "Digital Fashion: Bettr Tee", desc: "Wearable in mixed reality." },
  { id: "mr-1", name: "MR Item: Study Lamp", desc: "Virtual focus companion." },
];

export default function AIMarketplacePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-bettr-forest">AI Assistants & Digital Assets</h1>
        <p className="mt-1 text-bettr-navy/70">
          Conceptual marketplace UI. Assistant preview cards and purchase flow mockups. No real AI or blockchain execution.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-bettr-forest">AI Assistants</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ASSISTANTS.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-bettr-sage/30 bg-white/80 p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 h-12 w-12 rounded-lg bg-bettr-mint text-bettr-forest flex items-center justify-center text-xl">
                🤖
              </div>
              <h3 className="font-medium text-bettr-navy">{a.name}</h3>
              <p className="mt-1 text-sm text-bettr-navy/70">{a.desc}</p>
              <button
                type="button"
                className="mt-3 w-full rounded-lg border border-bettr-sage bg-bettr-cream py-2 text-sm font-medium text-bettr-forest transition hover:bg-bettr-mint/50"
              >
                Preview
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-bettr-forest">Digital Assets</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ASSETS.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-bettr-sage/30 bg-white/80 p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 h-24 rounded-lg bg-bettr-sage/30 text-bettr-forest flex items-center justify-center text-3xl">
                ✨
              </div>
              <h3 className="font-medium text-bettr-navy">{a.name}</h3>
              <p className="mt-1 text-sm text-bettr-navy/70">{a.desc}</p>
              <button
                type="button"
                className="mt-3 w-full rounded-lg border border-bettr-sage bg-bettr-cream py-2 text-sm font-medium text-bettr-forest transition hover:bg-bettr-mint/50"
              >
                View (mock)
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-bettr-sage/30 bg-bettr-cream/50 p-4 text-sm text-bettr-navy/80">
        <p>
          <strong>Integration-ready:</strong> Solana (L1), Solana Pay, Token-2022, ZK Proofs, Metaplex DAS / MPL Core, SPL-404 hybrid assets are architectured and commented — not implemented in MVP.
        </p>
      </div>

      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm font-medium text-bettr-forest hover:underline"
      >
        ← Back to Algorithm Marketplace
      </Link>
    </div>
  );
}
