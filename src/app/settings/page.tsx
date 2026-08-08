"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  KeyRound,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { CountryPicker } from "@/components/country-picker";
import { PageHeader } from "@/components/signage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/auth";

const questions = [
  { id: "fear", label: "What's the scariest part of your move?" },
  { id: "want", label: "One thing you want to do at your new school?" },
  { id: "alone", label: "What do you do when you feel alone?" },
  { id: "show", label: "What's the first thing you'd show a new kid?" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("mover");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [school, setSchool] = useState("");
  const [country, setCountry] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        const me = data.me;
        if (me) {
          setRole(String(me.role ?? "mover"));
          setName(String(me.name ?? ""));
          setAge(me.age ? String(me.age) : "");
          setFrom(String(me.from_place ?? ""));
          setTo(String(me.to_place ?? ""));
          setSchool(String(me.school ?? ""));
          setCountry(String(me.country ?? ""));
          setMoveDate(String(me.move_date ?? ""));
          setAvatarUrl(String(me.avatar_url ?? ""));
          setAnswers(
            me.answers && typeof me.answers === "object" ? me.answers : {}
          );
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
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
          restart: false,
          avatarUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't save — are you signed in?");
        return;
      }
      toast.success("Profile saved");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("That's not an image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Keep it under 2MB");
      return;
    }
    if (!isSupabaseConfigured()) {
      toast.error("Supabase isn't connected yet");
      return;
    }
    setAvatarBusy(true);
    try {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase!.auth.getUser();
      if (!user) {
        toast.error("Not signed in");
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${user.id}.${ext}`;
      const { error } = await supabase!.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (error) {
        toast.error(error.message);
        return;
      }
      const { data: pub } = supabase!.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(pub.publicUrl);
      toast.success("Photo ready — save your profile to keep it");
    } finally {
      setAvatarBusy(false);
    }
  }

  function removeAvatar() {
    setAvatarUrl("");
    toast.success("Photo removed — save your profile to keep it");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) {
      toast.error("Password needs at least 8 characters");
      return;
    }
    if (pw !== pwConfirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (!isSupabaseConfigured()) {
      toast.error("Supabase isn't connected yet");
      return;
    }
    setPwBusy(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase!.auth.updateUser({ password: pw });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Password changed");
      setPw("");
      setPwConfirm("");
    } finally {
      setPwBusy(false);
    }
  }

  async function eraseAccount() {
    setErasing(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Couldn't erase — try again");
        return;
      }
      localStorage.removeItem("buddy:session");
      localStorage.removeItem("buddy:role");
      toast.success("Account erased. Take care — the chain remembers you.");
      router.push("/");
      router.refresh();
    } finally {
      setErasing(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <PageHeader
          tag="Settings"
          title="Make it yours."
          lede="Your profile, your password, your data. Everything here is private by design — only your matches ever see your answers."
        />

        <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <div className="space-y-10">
              {/* Profile */}
              <form
                onSubmit={saveProfile}
                className="border-2 border-ink/30 bg-paper p-6 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]"
              >
                <p className="board flex items-center gap-2 text-[11px] tracking-[0.25em] text-amber-deep">
                  <UserRound className="size-4" /> YOUR PROFILE
                </p>

                <div className="mt-5 flex items-center gap-4">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt="Your profile photo"
                      className="size-20 shrink-0 border-2 border-ink object-cover"
                    />
                  ) : (
                    <span className="board flex size-20 shrink-0 items-center justify-center border-2 border-ink bg-ink text-xl font-bold text-paper">
                      {name
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase() ?? "")
                        .join("") || "?"}
                    </span>
                  )}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="board inline-flex cursor-pointer items-center gap-2 border-2 border-ink bg-ink px-3 py-2 text-[11px] tracking-[0.18em] text-paper transition-colors hover:bg-ink/90">
                        <Camera className="size-3.5" />
                        {avatarBusy ? "Uploading…" : "Upload photo"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={avatarBusy}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadAvatar(f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {avatarUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeAvatar}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PNG or JPG, under 2MB. Shown to your matches and on your
                      card.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from">Leaving</Label>
                    <Input
                      id="from"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="City, country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">Going to</Label>
                    <Input
                      id="to"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="school">School</Label>
                    <Input
                      id="school"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <CountryPicker
                      id="country"
                      value={country}
                      onValueChange={setCountry}
                      placeholder="Pick a country…"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moveDate">Move date</Label>
                    <Input
                      id="moveDate"
                      type="date"
                      value={moveDate}
                      onChange={(e) => setMoveDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <p className="board text-[10px] tracking-[0.2em] text-ink/55">
                    YOUR QUESTIONS — WHAT YOUR BUDDY SEES
                  </p>
                  {questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                      <Label htmlFor={`q-${q.id}`}>{q.label}</Label>
                      <Textarea
                        id={`q-${q.id}`}
                        value={answers[q.id] || ""}
                        onChange={(e) =>
                          setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                        }
                        className="min-h-20"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-ink/20 pt-4">
                  <p className="text-xs text-muted-foreground">
                    Changing your destination re-lands you on the board.
                  </p>
                  <Button type="submit" disabled={saving}>
                    <Save /> {saving ? "Saving…" : "Save profile"}
                  </Button>
                </div>
              </form>

              {/* Password */}
              <form
                onSubmit={changePassword}
                className="border-2 border-ink/30 bg-paper p-6 shadow-[3px_3px_0_0_rgba(22,19,14,0.14)]"
              >
                <p className="board flex items-center gap-2 text-[11px] tracking-[0.25em] text-amber-deep">
                  <KeyRound className="size-4" /> PASSWORD
                </p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pw">New password</Label>
                    <Input
                      id="pw"
                      type="password"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      placeholder="8+ characters"
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pw-confirm">Confirm</Label>
                    <Input
                      id="pw-confirm"
                      type="password"
                      value={pwConfirm}
                      onChange={(e) => setPwConfirm(e.target.value)}
                      placeholder="Again, to be sure"
                      minLength={8}
                      required
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button type="submit" variant="outline" disabled={pwBusy}>
                    {pwBusy ? "Changing…" : "Change password"}
                  </Button>
                </div>
              </form>

              {/* Danger zone */}
              <div className="border-2 border-alarm/40 bg-alarm/5 p-6">
                <p className="board flex items-center gap-2 text-[11px] tracking-[0.25em] text-alarm">
                  <Trash2 className="size-4" /> DANGER ZONE
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">
                  Erasing your account deletes your profile, your match, your
                  messages, your arrival row and your lounge posts — everything,
                  permanently. The kids you carried keep their chain; that part
                  of you stays with them.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="mt-4"
                      disabled={erasing}
                    >
                      <Trash2 /> Erase my account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="uppercase">
                        Erase everything?
                      </DialogTitle>
                      <DialogDescription>
                        This can&apos;t be undone. Your profile, match, messages
                        and arrival row are deleted for good.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Keep my account</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={eraseAccount}>
                        <Trash2 /> Yes, erase it all
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <p className="board flex items-center gap-2 text-[11px] tracking-[0.15em] text-ink/55">
                <ShieldCheck className="size-4 text-amber-deep" />
                Your answers are only visible to your matches. Nothing here is
                public — ever.
              </p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
