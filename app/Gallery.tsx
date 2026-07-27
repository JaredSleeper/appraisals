"use client";

import { useCallback, useEffect, useState } from "react";

export type Item = {
  slug: string;
  image: string;
  thumb: string;
  description: string;
  price_low: number;
  price_high: number;
  note: string;
};

function money(lo: number, hi: number) {
  if (!hi) return "—";
  if (lo === hi) return `$${lo}`;
  return `$${lo}–${hi}`;
}

export default function Gallery({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback(
    (delta: number) =>
      setOpen((cur) =>
        cur === null ? cur : (cur + delta + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, move]);

  const active = open === null ? null : items[open];

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="bg-card text-left text-xs uppercase tracking-wide text-muted">
              <th className="p-2 font-medium">Image</th>
              <th className="p-2 font-medium">Description</th>
              <th className="p-2 text-right font-medium">Est. price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.slug}
                className="border-t border-border align-top odd:bg-background even:bg-card"
              >
                <td className="p-2">
                  <button
                    onClick={() => setOpen(idx)}
                    className="block overflow-hidden rounded-lg border border-border transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="Enlarge photo"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumb}
                      alt={item.description || item.slug}
                      loading="lazy"
                      className="h-20 w-20 cursor-zoom-in object-cover sm:h-24 sm:w-24"
                    />
                  </button>
                </td>
                <td className="p-2 leading-relaxed">
                  {item.description || (
                    <span className="text-muted">Awaiting description…</span>
                  )}
                  {item.note && (
                    <span className="mt-1 block text-xs text-muted">
                      {item.note}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap p-2 text-right font-medium">
                  {money(item.price_low, item.price_high)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative flex max-h-full max-w-3xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image}
              alt={active.description || active.slug}
              className="max-h-[75vh] w-auto rounded-lg object-contain"
            />
            <div className="mt-3 rounded-lg bg-card/95 p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="leading-relaxed">{active.description}</p>
                <span className="shrink-0 font-medium">
                  {money(active.price_low, active.price_high)}
                </span>
              </div>
              {active.note && (
                <p className="mt-1 text-xs text-muted">{active.note}</p>
              )}
            </div>
          </div>

          {/* controls */}
          <button
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-lg text-white hover:bg-white/20"
            aria-label="Close"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-xl text-white hover:bg-white/20"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-xl text-white hover:bg-white/20"
            aria-label="Next"
          >
            ›
          </button>
          <p className="absolute bottom-4 text-xs text-white/70">
            {open! + 1} of {items.length}
          </p>
        </div>
      )}
    </>
  );
}
