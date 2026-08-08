import Link from "next/link";

import { Barcode } from "@/components/barcode";
import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/map", label: "The Map" },
      { href: "/chat", label: "Chat" },
      { href: "/matches", label: "Your buddy" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/community", label: "The lounge" },
      { href: "/places", label: "Country guides" },
      { href: "/about", label: "The story" },
      { href: "/safety", label: "Safety" },
    ],
  },
  {
    title: "Buddy",
    links: [
      { href: "/signup", label: "Get a buddy" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_auto]">
        <div className="max-w-sm">
          <Logo on="ink" />
          <p className="mt-5 text-sm leading-relaxed text-paper/70">
            Never start at zero. Buddy matches kids moving to a new school or
            country with someone already waiting there — before they arrive.
          </p>
          <p className="board mt-6 text-[11px] tracking-[0.2em] text-paper/50">
            built by a kid who moved too many times to count
          </p>
          <Barcode seed="buddy-the-chain" className="mt-6 h-8 w-44 opacity-70" />
        </div>
        <div className="grid grid-cols-2 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="board text-[11px] tracking-[0.25em] text-amber">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-paper/70 transition-colors hover:text-amber"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="board mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-[11px] tracking-[0.15em] text-paper/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 Buddy — no likes, no followers, no algorithms</span>
          <span>14+ only · profiles are private by design</span>
        </div>
      </div>
    </footer>
  );
}
