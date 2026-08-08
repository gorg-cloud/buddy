export function ConnectNotice() {
  return (
    <div className="border-2 border-amber/50 bg-amber/10 px-4 py-3">
      <p className="board text-[11px] tracking-[0.2em] text-amber-deep">
        DATABASE NOT CONNECTED
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink/75">
        Buddy has no demo data — real accounts, matches, and missions run on
        your free Supabase project. Put the keys in{" "}
        <code className="board text-xs text-ink">.env.local</code> and restart
        the server. Full steps are in the README.
      </p>
    </div>
  );
}
