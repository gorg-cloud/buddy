export type ProfileRole = "mover" | "buddy" | "anchor";

export interface BuddyProfile {
  id: string;
  handle: string;
  name: string;
  age: number;
  role: ProfileRole;
  from: string;
  to: string;
  school: string;
  country: string;
  moveDate?: string; // ISO — when the mover lands
  answers: Record<string, string>; // questions-first profile
  carried: number; // how many kids this person has helped (the Chain)
  languages: string[];
}

export interface AnchorProfile {
  id: string;
  name: string;
  age: number;
  country: string;
  city: string;
  yearsLived: number;
  expertise: string[];
  answers: Record<string, string>;
  languages: string[];
}

export interface Arrival {
  id: string;
  flight: string;
  from: string;
  to: string;
  status: "found" | "waiting";
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  done: boolean;
  kind: "intro" | "landing" | "settle";
}

/** A person plotted on the real map. */
export interface MapPerson {
  id: string;
  name: string;
  kind: "anchor" | "peer";
  country: string;
  city?: string;
  lat: number;
  lng: number;
  code: string; // IATA-style country code (ISO 3166-1 alpha-2)
  detail: string;
}
