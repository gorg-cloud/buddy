"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquareText, Send } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatClock, initials } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  sender: string;
  sender_name?: string;
  body: string;
  created_at: string;
}

interface BaseState {
  loading: boolean;
  signedIn: boolean;
  messages: ChatMessage[];
}

/**
 * The Buddy chat — one component, two rooms:
 *  - mode "match": the private chat between a mover and their buddy.
 *  - mode "community": the public lounge, global or per-country.
 * Polls every 4s so replies land without a refresh.
 */
export function ChatRoom({
  mode,
  room,
}: {
  mode: "match" | "community";
  room?: string;
}) {
  const [state, setState] = useState<BaseState>({
    loading: true,
    signedIn: false,
    messages: [],
  });
  const [needsProfile, setNeedsProfile] = useState(false);
  const [matched, setMatched] = useState(mode === "community");
  const [dbError, setDbError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const [buddy, setBuddy] = useState<{
    name?: string | null;
    school?: string | null;
    from?: string | null;
    to?: string | null;
  } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endpoint =
    mode === "match"
      ? "/api/messages"
      : `/api/community?room=${encodeURIComponent(room ?? "global")}`;

  useEffect(() => {
    let cancelled = false;

    // Poll the room — replies land without a refresh.
    async function tick() {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (cancelled) return;
        setState({
          loading: false,
          signedIn: Boolean(data.signedIn),
          messages: Array.isArray(data.messages)
            ? data.messages.map((m: ChatMessage) => ({
                id: String(m.id),
                sender: String(m.sender),
                sender_name: m.sender_name ? String(m.sender_name) : undefined,
                body: String(m.body),
                created_at: String(m.created_at),
              }))
            : [],
        });
        setDbError(data.error ? String(data.error) : null);
        setMyId(data.meId ?? null);
        if (mode === "match") {
          setNeedsProfile(Boolean(data.needsProfile));
          setMatched(Boolean(data.matched));
          if (data.buddy) {
            setBuddy({
              name: data.buddy.name ? String(data.buddy.name) : null,
              school: data.buddy.school ? String(data.buddy.school) : null,
              from: data.buddy.from_place ? String(data.buddy.from_place) : null,
              to: data.buddy.to_place ? String(data.buddy.to_place) : null,
            });
          }
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    }

    tick();
    pollRef.current = setInterval(tick, 4000);
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [endpoint, mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.messages.length]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await fetch(
        mode === "match" ? "/api/messages" : "/api/community",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "match" ? { body: text } : { room, body: text }
          ),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't send — try again");
        return;
      }
      setDraft("");
      // Optimistic append — the message appears instantly, polling confirms.
      const m = data.message;
      if (m) {
        setState((s) => ({
          ...s,
          messages: [
            ...s.messages,
            {
              id: String(m.id),
              sender: String(m.sender),
              sender_name: m.sender_name ? String(m.sender_name) : undefined,
              body: String(m.body),
              created_at: String(m.created_at),
            },
          ],
        }));
      }
    } finally {
      setSending(false);
    }
  }

  const title =
    mode === "match"
      ? "Chat with your buddy"
      : room === "global"
        ? "The global lounge"
        : `The ${room} lounge`;

  return (
    <div className="flex h-[560px] flex-col border-2 border-ink/30 bg-paper shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]">
      {/* Machine header */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink bg-ink px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="board flex size-9 shrink-0 items-center justify-center bg-amber text-xs font-bold text-ink">
            {mode === "match" ? initials(buddy?.name ?? "Buddy") : "★"}
          </span>
          <div className="min-w-0">
            <p className="board truncate text-[11px] tracking-[0.2em] text-paper">
              {title}
            </p>
            {mode === "match" && buddy?.name && (
              <p className="board truncate text-[9px] tracking-[0.15em] text-paper/50">
                {buddy.from ?? "—"} → {buddy.to ?? "—"} · {buddy.school ?? "school"}
              </p>
            )}
            {mode === "community" && (
              <p className="board truncate text-[9px] tracking-[0.15em] text-paper/50">
                NO LIKES · NO FOLLOWERS · JUST PEOPLE
              </p>
            )}
          </div>
        </div>
        {state.signedIn && (
          <Badge variant="success" className="shrink-0">
            ONLINE
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 px-4 py-5">
        {dbError ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 border-2 border-amber/40 bg-amber/10 p-6 text-center">
            <p className="board text-xs tracking-[0.2em] text-amber-deep">
              LOUNGE NOT SET UP YET
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-ink/75">
              The chat table hasn&apos;t been created in your database yet.
              Run{" "}
              <code className="board text-xs text-ink">supabase/schema-update.sql</code>{" "}
              in the Supabase SQL editor (one paste, same as before) and this
              room comes alive.
            </p>
          </div>
        ) : state.loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="ml-auto h-12 w-1/2" />
            <Skeleton className="h-12 w-2/3" />
          </div>
        ) : state.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            {mode === "match" && !matched ? (
              <>
                <MessageSquareText className="size-8 text-ink/25" />
                <p className="board text-sm tracking-[0.2em] text-amber-deep">
                  NO MATCH YET
                </p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Chat unlocks the moment you&apos;re matched with a buddy at
                  your new school. Check back soon.
                </p>
                <Button size="sm" asChild className="mt-2">
                  <Link href="/matches">
                    See your match <ArrowRight />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <MessageSquareText className="size-8 text-ink/25" />
                <p className="board text-sm tracking-[0.2em] text-amber-deep">
                  {mode === "community" ? "THE LOUNGE IS EMPTY" : "NO MESSAGES YET"}
                </p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  {mode === "community"
                    ? "Be the first to say something — a hello, a question, a tip for the new kid."
                    : "Send the first hello. One thing you're scared of, one thing you're excited about."}
                </p>
              </>
            )}
          </div>
        ) : (
          state.messages.map((m) => {
            const mine = myId ? m.sender === myId : false;
            return (
              <div
                key={m.id}
                className={cn("flex items-end gap-2", mine && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "board flex size-7 shrink-0 items-center justify-center text-[10px] font-bold",
                    mine ? "bg-ink text-amber" : "bg-ink text-paper"
                  )}
                >
                  {initials(m.sender_name ?? "You")}
                </span>
                <div
                  className={cn(
                    "max-w-[78%] border-2 px-3 py-2",
                    mine
                      ? "border-ink bg-amber/90 text-ink"
                      : "border-ink/25 bg-paper text-ink"
                  )}
                >
                  {mode === "community" && !mine && m.sender_name && (
                    <p className="board text-[9px] tracking-[0.15em] text-amber-deep">
                      {m.sender_name}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed break-words">{m.body}</p>
                  <p
                    className={cn(
                      "board mt-1 text-right text-[9px] tracking-[0.1em]",
                      mine ? "text-ink/50" : "text-ink/40"
                    )}
                  >
                    {formatClock(m.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t-2 border-ink/20 p-3">
        {!state.signedIn ? (
          <div className="flex items-center justify-between gap-3 border-2 border-amber/40 bg-amber/10 px-3 py-2.5">
            <p className="board text-[10px] tracking-[0.18em] text-amber-deep">
              {mode === "match"
                ? "LOG IN TO TALK TO YOUR BUDDY"
                : "LOG IN TO SPEAK IN THE LOUNGE"}
            </p>
            <Button size="sm" asChild>
              <Link href="/login">
                Log in <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : needsProfile ? (
          <div className="flex items-center justify-between gap-3 border-2 border-amber/40 bg-amber/10 px-3 py-2.5">
            <p className="board text-[10px] tracking-[0.18em] text-amber-deep">
              FINISH ONBOARDING BEFORE YOU TALK
            </p>
            <Button size="sm" asChild>
              <Link href="/onboarding">
                Build my profile <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : (
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              maxLength={500}
              placeholder={
                mode === "match"
                  ? "Say hello — one thing you're scared of, one you're excited about…"
                  : "Ask the room anything, or share what you know…"
              }
              aria-label="Message"
              className="min-h-12 flex-1 resize-none border-2 border-ink/25 bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            <Button
              type="submit"
              size="icon"
              className="h-12 w-12 shrink-0"
              disabled={sending || draft.trim().length === 0}
              aria-label="Send message"
            >
              <Send />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
