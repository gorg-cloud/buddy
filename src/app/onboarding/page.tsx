"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { CountryPicker } from "@/components/country-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/logo";
import {
  RESTART_KEY,
  ROLE_KEY,
  SESSION_KEY,
  isSupabaseConfigured,
} from "@/lib/auth";

const questions = [
  {
    id: "fear",
    label: "What's the scariest part of your move?",
    placeholder: "Be honest — this is what your buddy will respond to.",
  },
  {
    id: "want",
    label: "One thing you want to do at your new school?",
    placeholder: "A club, a team, a thing you refuse to give up.",
  },
  {
    id: "alone",
    label: "What do you do when you feel alone?",
    placeholder: "The thing that gets you through. No wrong answers.",
  },
  {
    id: "show",
    label: "What's the first thing you'd show a new kid?",
    placeholder: "The thing you wish someone had shown you.",
  },
];

type Step = "The basics" | "Your questions";

const stepIndex: Record<Step, number> = { "The basics": 1, "Your questions": 2 };

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("The basics");

  const [name, setName] = useState("You");
  const [age, setAge] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [school, setSchool] = useState("");
  const [country, setCountry] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  async function save() {
    if (!isSupabaseConfigured()) {
      toast.error(
        "Supabase isn't connected yet — add your keys to .env.local and restart"
      );
      return;
    }

    // A new move? No matter what they were before, they're a mover now.
    const restart = localStorage.getItem(RESTART_KEY) === "1";
    localStorage.removeItem(RESTART_KEY);
    const role = restart ? "mover" : (localStorage.getItem(ROLE_KEY) ?? "mover");
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
    session.onboarded = true;
    session.name = name;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        age,
        from,
        to,
        school,
        country,
        moveDate,
        answers,
        role,
        restart,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(
        data.error ?? "Couldn't save your profile — are you signed in?"
      );
      return;
    }

    toast.success("Profile saved — finding your buddy");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-ink bg-paper">
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <span className="board text-[11px] tracking-[0.2em] text-ink/55">
            STEP {stepIndex[step]} / 2 — {step.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <Tabs value={step} onValueChange={(v) => setStep(v as Step)}>
          <TabsList>
            <TabsTrigger value="The basics">The basics</TabsTrigger>
            <TabsTrigger value="Your questions">Your questions</TabsTrigger>
          </TabsList>

          <TabsContent value="The basics">              <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!country) {
                  toast.error("Pick the country you're moving to");
                  return;
                }
                setStep("Your questions");
              }}
            >
              <div>
                <h1 className="font-display text-3xl uppercase tracking-tight">
                  The basics
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Who you are, and where you&apos;re headed.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={14}
                    max={18}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="14–18"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from">Leaving</Label>
                  <Input
                    id="from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="City, country"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">Going to</Label>
                  <Input
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="City — e.g. Lisbon"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="school">New school</Label>
                  <Input
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="The school you'll be at"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country you&apos;re moving to</Label>
                  <CountryPicker
                    id="country"
                    value={country}
                    onValueChange={setCountry}
                    placeholder="Search 250 real countries…"
                  />
                  {!country && (
                    <p className="text-xs text-alarm">
                      Matching runs on this — every real place is in the list.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moveDate">Move date</Label>
                  <Input
                    id="moveDate"
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" asChild>
                  <Link href="/signup">
                    <ArrowLeft /> Back
                  </Link>
                </Button>
                <Button type="submit">
                  Next: your questions <ArrowRight />
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="Your questions">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <div>
                <h1 className="font-display text-3xl uppercase tracking-tight">
                  Questions, not bios
                </h1>
                <p className="mt-2 text-muted-foreground">
                  No &quot;about me&quot; essays. Answer these honestly —
                  it&apos;s what your buddy connects with.
                </p>
              </div>

              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div key={q.id} className="space-y-2">
                    <Label htmlFor={q.id}>
                      <span className="board mr-2 text-amber-deep">Q{i + 1}</span>
                      {q.label}
                    </Label>
                    <Textarea
                      id={q.id}
                      value={answers[q.id] || ""}
                      onChange={(e) =>
                        setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                      }
                      placeholder={q.placeholder}
                      className="min-h-24"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("The basics")}
                >
                  <ArrowLeft /> Back
                </Button>
                <Button type="submit">
                  Save my profile <ArrowRight />
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <p className="board mt-8 flex items-center gap-2 text-[11px] tracking-[0.15em] text-ink/55">
          <ShieldCheck className="size-4 text-amber-deep" />
          Your answers are only visible to your matches. Nothing is public.
        </p>
      </main>
    </div>
  );
}
