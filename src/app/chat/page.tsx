import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ChatRoom } from "@/components/chat-room";
import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Chat — Buddy",
  description:
    "The private chat between you and your buddy — no likes, no followers, just two kids who get it.",
};

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag="Your chat"
          title="Talk to your buddy."
          lede="Your private line with the kid waiting at your new school. Ask anything — the scary questions, the silly ones, the ones you can't ask anyone else."
        />

        <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
          <ChatRoom mode="match" />

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-2 border-ink/30 bg-paper p-6 sm:flex-row sm:items-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Never share your address, your school timetable, or anything you
              wouldn&apos;t tell a stranger. If someone makes you uncomfortable,
              tell a trusted adult — Buddy is a safety-first zone.
            </p>
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link href="/safety">
                Read the safety rules <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
