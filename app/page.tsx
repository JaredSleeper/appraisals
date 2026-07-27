import items from "@/data/items.json";
import Gallery, { type Item } from "./Gallery";

const SITE_TITLE = process.env.SITE_TITLE || "Hummel Collection";

export default function Home() {
  const data = items as Item[];
  const totalLo = data.reduce((s, i) => s + (i.price_low || 0), 0);
  const totalHi = data.reduce((s, i) => s + (i.price_high || 0), 0);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          Estate appraisal
        </p>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{SITE_TITLE}</h1>
        <p className="mt-2 text-sm text-muted">
          {data.length} pieces · rough estimated total{" "}
          <strong className="text-foreground">
            ${totalLo.toLocaleString()}–${totalHi.toLocaleString()}
          </strong>
          . Tap any photo to enlarge it.
        </p>
        <p className="mt-2 text-xs text-muted">
          Descriptions and prices are AI-generated rough estimates for the
          secondhand/collector market — a starting point, not a formal appraisal.
        </p>
      </header>

      <Gallery items={data} />
    </main>
  );
}
