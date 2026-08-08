"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/map", label: "The Map" },
  { href: "/community", label: "Community" },
  { href: "/chat", label: "Chat" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

interface Session {
  signedIn: boolean;
  name: string | null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session>({
    signedIn: false,
    name: null,
  });
  const [loaded, setLoaded] = useState(false);

  // Real session from Supabase cookies — re-checks on every navigation.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setSession({
          signedIn: Boolean(data.signedIn),
          name: data.name ? String(data.name) : null,
        });
      })
      .catch(() => {
        if (!cancelled) setSession({ signedIn: false, name: null });
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function logout() {
    try {
      await fetch("/api/session", { method: "POST" });
      setSession({ signedIn: false, name: null });
      localStorage.removeItem("buddy:session");
      toast.success("Logged out — see you at the gate");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Couldn't log out — try again");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "board relative px-3 py-2 text-[11px] tracking-[0.18em] text-ink/60 transition-colors hover:text-ink",
                pathname === link.href && "text-ink"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-0 h-0.5 bg-amber",
                  pathname === link.href ? "block" : "hidden"
                )}
                aria-hidden
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loaded && session.signedIn ? (
            <>
              <span className="board max-w-28 truncate text-[10px] tracking-[0.15em] text-ink/60">
                {session.name?.toUpperCase()}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Settings">
                <Link href="/settings" title="Settings">
                  <SettingsIcon />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get a buddy</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-l-2 border-ink bg-paper">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "board rounded-none px-3 py-3 text-xs tracking-[0.18em] text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink",
                    pathname === link.href && "text-ink"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                {loaded && session.signedIn ? (
                  <>
                    <Button asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/settings">Settings</Link>
                    </Button>
                    <Button variant="outline" onClick={logout}>
                      Log out <LogOut />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild>
                      <Link href="/signup">Get a buddy</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/login">Log in</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
