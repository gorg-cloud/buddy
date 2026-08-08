// Generates src/lib/countries-data.json — a distilled, real country dataset
// (code, name, lat/lng, region) so the client bundle stays tiny instead of
// shipping world-countries' full translations payload.
//
// Run: node scripts/gen-countries.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import countries from "world-countries";

const rows = countries
  .map((c) => ({
    code: c.cca2,
    name: c.name.common,
    lat: c.latlng[0],
    lng: c.latlng[1],
    region: c.region,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "lib",
  "countries-data.json"
);
writeFileSync(out, JSON.stringify(rows, null, 0) + "\n");
console.log(`Wrote ${rows.length} countries to ${out}`);
