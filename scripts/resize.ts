import { readdirSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, extname } from "path";
import sharp from "sharp";

// Resize raw photos in ./ingest-staging into web-ready images in ./public/items,
// and seed ./data/items.json with one entry each. Idempotent; preserves any
// description/price already present in items.json (matched by slug).

const STAGING = join(process.cwd(), "ingest-staging");
const OUT = join(process.cwd(), "public", "items");
const DATA = join(process.cwd(), "data", "items.json");
const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff"]);

type Item = {
  slug: string;
  image: string;
  thumb: string;
  description: string;
  price_low: number;
  price_high: number;
  note: string;
};

async function main() {
  if (!existsSync(STAGING)) {
    console.error(`No ${STAGING}. Put photos there first.`);
    process.exit(1);
  }
  mkdirSync(OUT, { recursive: true });

  const existing: Record<string, Item> = {};
  if (existsSync(DATA)) {
    for (const it of JSON.parse(readFileSync(DATA, "utf8")) as Item[])
      existing[it.slug] = it;
  }

  const files = readdirSync(STAGING)
    .filter((f) => IMG_EXT.has(extname(f).toLowerCase()))
    .sort();

  const items: Item[] = [];
  let i = 0;
  for (const file of files) {
    i++;
    const slug = `item-${String(i).padStart(3, "0")}`;
    const full = `${slug}.webp`;
    const thumb = `${slug}.thumb.webp`;
    await sharp(join(STAGING, file))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(OUT, full));
    await sharp(join(STAGING, file))
      .rotate()
      .resize({ width: 480, height: 480, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(join(OUT, thumb));

    const prev = existing[slug];
    items.push({
      slug,
      image: `/items/${full}`,
      thumb: `/items/${thumb}`,
      description: prev?.description ?? "",
      price_low: prev?.price_low ?? 0,
      price_high: prev?.price_high ?? 0,
      note: prev?.note ?? "",
    });
    console.log(`  ${slug}  ${file}`);
  }

  writeFileSync(DATA, JSON.stringify(items, null, 2));
  console.log(`\nResized ${i} images; wrote ${DATA}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
