"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      const { error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(error.message);
        setBusy(false);
        return;
      }
      router.push("/dashboard");
      return;
    }

    // Demo mode — drop straight in
    const session: Session = {
      name: "You",
      email,
      role: "mover",
      onboarded: true,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    toast.success("Welcome back");
    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r-2 border-ink bg-ink lg:block">
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo on="ink" />
          <div>
            <p className="board text-xs tracking-[0.25em] text-amber">
              Welcome back
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight uppercase tracking-tight text-paper">
              Your people are
              <br />
              still <span className="text-amber">waiting</span>.
            </h1>
            <p className="mt-4 max-w-sm text-paper/70">
              Your buddy is already there. Pick up where you left off.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl uppercase">
              Log in
            </CardTitle>
            <CardDescription>Pick up where you left off.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Your password"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Logging in…" : "Log in"}
                {!busy && <ArrowRight />}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                New here?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Get a buddy
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
