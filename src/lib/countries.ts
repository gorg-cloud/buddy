import data from "@/lib/countries-data.json";

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  lat: number;
  lng: number;
  region: string;
}

export const COUNTRIES: Country[] = data as Country[];

const byName = new Map<string, Country>(
  COUNTRIES.map((c) => [c.name.toLowerCase(), c])
);
const byCode = new Map<string, Country>(
  COUNTRIES.map((c) => [c.code.toLowerCase(), c])
);

/** URL-safe slug for a country name, e.g. "United Arab Emirates" → "united-arab-emirates". */
export function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const bySlug = new Map<string, Country>(
  COUNTRIES.map((c) => [slugify(c.name), c])
);

export function countryByName(name: string): Country | undefined {
  return byName.get(name.trim().toLowerCase());
}

export function countryByCode(code: string): Country | undefined {
  return byCode.get(code.trim().toLowerCase());
}

export function countryBySlug(slug: string): Country | undefined {
  return bySlug.get(slug.trim().toLowerCase());
}
