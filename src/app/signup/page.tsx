"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Plane } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import {
  ROLE_KEY,
  SESSION_KEY,
  isSupabaseConfigured,
  type Session,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

type Role = Session["role"];

const roles: { value: Role; label: string; hint: string }[] = [
  { value: "mover", label: "I'm moving", hint: "Match me with a buddy at my new school" },
  { value: "buddy", label: "I can be a buddy", hint: "Help the next kid arriving at my school" },
  { value: "anchor", label: "I'm an anchor", hint: "Answer questions from kids in my country" },
];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("mover");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    if (!isSupabaseConfigured()) {
      toast.error(
        "Supabase isn't connected yet — add your keys to .env.local and restart"
      );
      setBusy(false);
      return;
    }

    // Server-side signup: creates the account, confirms the email, and
    // signs the new kid in — no inbox waiting, straight into onboarding.
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error ?? "Couldn't create your account — try again");
      setBusy(false);
      return;
    }
    // The role travels to onboarding so it lands in the profile row.
    localStorage.setItem(ROLE_KEY, role);
    const session: Session = { name, email, role, onboarded: false };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    toast.success("Welcome to the chain — let's build your profile");
    router.push("/onboarding");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* left — mission panel */}
      <div className="relative hidden overflow-hidden border-r-2 border-ink bg-ink lg:block">
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo on="ink" />
          <div>
            <p className="board text-xs tracking-[0.25em] text-amber">
              Join the chain
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight uppercase tracking-tight text-paper">
              Your first day
              <br />
              doesn&apos;t have to
              <br />
              start at <span className="text-amber">zero</span>.
            </h1>
            <p className="mt-4 max-w-sm text-paper/70">
              Two minutes to make your profile. One buddy before you land.
              A chain that never stops.
            </p>
          </div>
          <div className="board flex items-center gap-2 text-[11px] tracking-[0.2em] text-paper/50">
            Profiles are private by design. Nothing public, ever.
          </div>
        </div>
      </div>

      {/* right — form */}
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl uppercase">
              Get a buddy
            </CardTitle>
            <CardDescription>
              First, what are you here for?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isSupabaseConfigured() && (
                <p className="board border-2 border-amber/40 bg-amber/10 px-3 py-2 text-[10px] tracking-[0.15em] text-amber-deep">
                  CONNECT SUPABASE TO ENABLE REAL ACCOUNTS — KEYS GO IN
                  .ENV.LOCAL
                </p>
              )}
              <div className="grid gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={cn(
                      "flex items-center gap-3 border-2 border-ink/25 bg-paper p-3 text-left transition-colors",
                      role === r.value && "border-ink bg-ink text-paper"
                    )}
                  >
                    <Plane
                      className={cn(
                        "size-4 text-ink/50",
                        role === r.value && "text-amber"
                      )}
                    />
                    <span>
                      <span
                        className={cn(
                          "block font-display text-sm uppercase tracking-wide",
                          role === r.value ? "text-paper" : "text-ink"
                        )}
                      >
                        {r.label}
                      </span>
                      <span
                        className={cn(
                          "block text-xs",
                          role === r.value ? "text-paper/70" : "text-muted-foreground"
                        )}
                      >
                        {r.hint}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should your buddy know you?"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8+ characters"
                  minLength={8}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Creating…" : "Create my profile"}
                {!busy && <ArrowRight />}
              </Button>
              <p className="board text-center text-[10px] tracking-[0.15em] text-ink/45">
                NO EMAIL CONFIRMATION — YOUR ACCOUNT WORKS THE SECOND YOU
                HIT CREATE
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Already have a buddy?{" "}
                <Link href="/login" className="text-amber-deep hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
