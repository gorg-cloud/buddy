import { ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const rules = [
  {
    title: "14+ only",
    body: "Buddy is built for teens. You must be 14 or older to have a profile.",
  },
  {
    title: "Profiles are private by design",
    body: "Nothing about you is public. No browsing, no search, no follower counts. You only ever see the people you're matched with.",
  },
  {
    title: "No meeting up. Ever.",
    body: "Anchors answer questions. They do not meet up. This is the one hard rule — a knowledge map, not a dating app.",
  },
  {
    title: "School first",
    body: "Every profile lists the school they're at or moving to. Matches are built around real schools and real places.",
  },
  {
    title: "Report anything wrong",
    body: "If a message makes you uncomfortable, report it. One tap, and our team sees it immediately.",
  },
  {
    title: "Never share private info",
    body: "Keep your address, phone number, and social handles off your profile and out of chats until you trust someone — and even then, be careful.",
  },
];

const faqs = [
  {
    q: "What if someone makes me uncomfortable?",
    a: "Use the report button on any conversation. It's one tap and the whole thread goes to our safety team. Blocking is instant — you never have to talk to them again.",
  },
  {
    q: "Is my profile visible to everyone?",
    a: "No. There is no public version of your profile. The only people who can see it are the 1–3 people you're matched with.",
  },
  {
    q: "Why are anchors not allowed to meet up?",
    a: "Because Buddy is for guidance and connection, not meetups. An anchor's job is to answer questions — what the school is like, what the city is like, how to settle in. Meeting up is outside the design, full stop.",
  },
  {
    q: "What if I move again?",
    a: "Buddy is built for exactly that. Your profile travels with you. When you land somewhere new, you get matched again — and your old buddies stay your friends. That's the point.",
  },
  {
    q: "Who runs Buddy?",
    a: "A kid who moved countries and schools more times than they can count, and built the thing they wish they'd had. All safety policies are written to be simple and absolute.",
  },
];

export default function SafetyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag="Safety"
          title="Simple rules. Absolute rules."
          lede="Buddy exists because starting over is lonely — and it only works if it's safe. These rules are the whole design, not a page of fine print."
        />

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <Alert variant="sky" className="mb-10 border-2 border-ink/25">
            <ShieldCheck />
            <AlertTitle className="font-display uppercase tracking-wide">
              The one hard rule
            </AlertTitle>
            <AlertDescription>
              Anchors answer questions. They never meet up. If you ever see
              anyone arranging to meet through Buddy, report it — that&apos;s
              not what this is.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule) => (
              <div
                key={rule.title}
                className="border-2 border-ink/30 bg-paper p-6 shadow-[2px_2px_0_0_rgba(22,19,14,0.14)]"
              >
                <h2 className="font-display text-lg uppercase tracking-wide">
                  {rule.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {rule.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="board text-[11px] tracking-[0.25em] text-ink/55">
              Questions
            </h2>
            <Accordion type="single" collapsible className="mt-2 max-w-3xl">
              {faqs.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="font-display text-base uppercase tracking-wide">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
