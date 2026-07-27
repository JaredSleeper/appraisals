# Appraisals — Hummel collection

A standalone, read-only appraisal gallery: a dense table of photographed items
with AI-drafted descriptions and rough secondhand value estimates. Click any
photo to enlarge it (lightbox with keyboard arrows).

Next.js (App Router), no database — data lives in `data/items.json`, images in
`public/items/`.

## Regenerate from photos
```bash
# put photos in ./ingest-staging (HEIC? convert: sips -s format jpeg *.heic --out .)
npm run resize     # → public/items/*.webp + seeds data/items.json
# then run the AI catalog pass to fill descriptions/prices in data/items.json
npm run dev        # http://localhost:3000
```
