"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Plane } from "lucide-react";
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
import { SESSION_KEY, isSupabaseConfigured, type Session } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase/client";
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

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      const { error } = await supabase!.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
        setBusy(false);
        return;
      }
      toast.success("Check your email to confirm your account");
      router.push("/login");
      return;
    }

    // Demo mode
    const session: Session = { name, email, role, onboarded: false };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    toast.success("Demo account created — let's build your profile");
    router.push("/onboarding");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* left — mission panel */}
      <div className="relative hidden overflow-hidden border-r border-border bg-card lg:block">
        <div className="terminal-grid absolute inset-0" aria-hidden />
        <div className="glow-amber absolute inset-0" aria-hidden />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo />
          <div>
            <p className="board text-xs text-primary">● JOIN THE CHAIN</p>
            <h1 className="mt-4 font-display text-4xl leading-tight font-extrabold">
              Your first day
              <br />
              doesn&apos;t have to
              <br />
              start at <span className="text-primary">zero</span>.
            </h1>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Two minutes to make your profile. One buddy before you land.
              A chain that never stops.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-primary" />
            Profiles are private by design. Nothing public, ever.
          </div>
        </div>
      </div>

      {/* right — form */}
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Get a buddy</CardTitle>
            <CardDescription>
              First, what are you here for?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 text-left transition-colors",
                      role === r.value &&
                        "border-primary bg-primary/10"
                    )}
                  >
                    <Plane
                      className={cn(
                        "size-4 text-muted-foreground",
                        role === r.value && "text-primary"
                      )}
                    />
                    <span>
                      <span className="block text-sm font-semibold">
                        {r.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
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
              <p className="text-center text-xs text-muted-foreground">
                Already have a buddy?{" "}
                <Link href="/login" className="text-primary hover:underline">
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
