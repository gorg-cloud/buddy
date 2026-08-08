"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/logo";
import { SESSION_KEY, isSupabaseConfigured } from "@/lib/auth";
import { cn } from "@/lib/utils";

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

const STEP_LABELS = ["The basics", "Your questions"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("You");
  const [age, setAge] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [school, setSchool] = useState("");
  const [country, setCountry] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  async function save() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
    session.onboarded = true;
    session.name = name;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(
      "buddy:profile",
      JSON.stringify({ name, age, from, to, school, country, moveDate, answers })
    );

    if (isSupabaseConfigured()) {
      await fetch("/api/profile", {
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
          role: session.role ?? "mover",
        }),
      });
    }

    toast.success("Profile saved — finding your buddy");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/70">
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <span className="board text-xs text-muted-foreground">
            STEP {step + 1} / 2 — {STEP_LABELS[step]}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        {step === 0 ? (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setStep(1);
            }}
          >
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight">
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
                  placeholder="City, country"
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
                <Label htmlFor="country">Country you're moving to</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Portugal"
                  required
                />
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
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight">
                Questions, not bios
              </h1>
              <p className="mt-2 text-muted-foreground">
                No &quot;about me&quot; essays. Answer these honestly — it&apos;s
                what your buddy connects with.
              </p>
            </div>

            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={q.id} className="space-y-2">
                  <Label htmlFor={q.id}>
                    <span className="board mr-2 text-primary">Q{i + 1}</span>
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
                onClick={() => setStep(0)}
              >
                <ArrowLeft /> Back
              </Button>
              <Button type="submit">
                Save my profile <ArrowRight />
              </Button>
            </div>
          </form>
        )}

        <p
          className={cn(
            "mt-10 flex items-center gap-2 text-xs text-muted-foreground",
            step === 1 && "mt-2"
          )}
        >
          <ShieldCheck className="size-4 text-primary" />
          Your answers are only visible to your matches. Nothing is public.
        </p>
      </main>
    </div>
  );
}
