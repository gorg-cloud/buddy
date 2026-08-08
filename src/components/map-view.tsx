"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { MapPerson } from "@/lib/types";

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function pinIcon(person: MapPerson) {
  const color = person.kind === "anchor" ? "#f2a516" : "#7dd3fc";
  return L.divIcon({
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
    html: `
      <div class="buddy-pin" style="--pin-color: ${color}" role="img" aria-label="${person.name}">
        <span class="buddy-pin__ring" aria-hidden="true"></span>
        <span class="buddy-pin__mono">${initials(person.name)}</span>
      </div>`,
  });
}

/** Fit the map to all pins; fall back to the world when there are none. */
function FitPins({ people }: { people: MapPerson[] }) {
  const map = useMap();
  useEffect(() => {
    if (people.length === 0) {
      map.setView([20, 0], 2);
      return;
    }
    const bounds = L.latLngBounds(people.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 5 });
  }, [people, map]);
  return null;
}

/** Fly to a location ("Find me"). */
function FlyTo({ focus }: { focus: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (focus) {
      map.flyTo([focus.lat, focus.lng], 4, { duration: 1.2 });
    }
  }, [focus, map]);
  return null;
}

export function MapView({
  people,
  focus,
}: {
  people: MapPerson[];
  focus: { lat: number; lng: number } | null;
}) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="z-0 h-full w-full"
      scrollWheelZoom={false}
      worldCopyJump
    >
      <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />
      {people.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(p)}>
          <Popup>
            <p className="board text-[9px] tracking-[0.2em] text-amber-deep">
              {p.kind === "anchor" ? "ANCHOR" : "PEER"} · {p.code}
            </p>
            <p className="mt-0.5 font-display text-sm uppercase tracking-wide">
              {p.name}
            </p>
            <p className="board mt-0.5 text-[10px] tracking-[0.12em] text-ink/60">
              {p.city ? `${p.city}, ` : ""}
              {p.country}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-ink/75">
              {p.detail}
            </p>
          </Popup>
        </Marker>
      ))}
      <FitPins people={people} />
      <FlyTo focus={focus} />
    </MapContainer>
  );
}
