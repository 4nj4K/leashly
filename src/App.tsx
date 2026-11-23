import { useEffect, useState } from "react";
import type { Family, Member, NewWalk, Walk } from "./types";
import { clearSession, loadSession, saveSession, type Session } from "./session";
import * as api from "./api";
import ThemeToggle from "./components/ThemeToggle";
import BottomNav, { type Tab } from "./components/BottomNav";
import WelcomePage from "./pages/WelcomePage";
import JoinPage from "./pages/JoinPage";
import InvitePage from "./pages/InvitePage";
import CalendarPage from "./pages/CalendarPage";
import RegisterPage from "./pages/RegisterPage";
import StatsPage from "./pages/StatsPage";

export default function App() {
  const [session, setSession] = useState<Session | null>(loadSession);
  const [joinCode, setJoinCode] = useState<string | null>(() =>
    loadSession() ? null : new URLSearchParams(window.location.search).get("join")
  );
  const [tab, setTab] = useState<Tab>("calendar");
  const [showInvite, setShowInvite] = useState(false);
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [walks, setWalks] = useState<Walk[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      api.getFamily(session.familyId),
      api.getMembers(session.familyId),
      api.getWalks(session.familyId),
    ])
      .then(([loadedFamily, loadedMembers, loadedWalks]) => {
        if (!loadedMembers.some((m) => m.id === session.memberId)) {
          clearSession();
          setSession(null);
          return;
        }
        setFamily(loadedFamily);
        setMembers(loadedMembers);
        setWalks(loadedWalks);
        setError(null);
      })
      .catch(() => setError("Kunde inte nå servern. Är backenden igång?"));
  }, [session]);

  function clearJoinCode() {
    window.history.replaceState(null, "", window.location.pathname);
    setJoinCode(null);
  }

  function handleWelcome(newSession: Session) {
    saveSession(newSession);
    clearJoinCode();
    setSession(newSession);
  }

  function changeTab(newTab: Tab) {
    setTab(newTab);
    setShowInvite(false);
  }

  async function addWalk(walk: NewWalk) {
    if (!session) return;
    try {
      const saved = await api.createWalk(session.familyId, walk);
      setWalks([...walks, saved]);
      setTab("calendar");
      setError(null);
    } catch {
      setError("Promenaden kunde inte sparas.");
    }
  }

  async function deleteWalk(id: number) {
    if (!session) return;
    try {
      await api.deleteWalk(session.familyId, id);
      setWalks(walks.filter((w) => w.id !== id));
      setError(null);
    } catch {
      setError("Promenaden kunde inte tas bort.");
    }
  }

  const header = (
    <header className="flex justify-between items-center">
      <p className="text-[11px] tracking-[0.18em] text-muted">LEASHLY</p>
      <ThemeToggle />
    </header>
  );

  if (!session) {
    return (
      <main className="min-h-screen max-w-md mx-auto p-6 flex flex-col gap-8">
        {header}
        {joinCode ? (
          <JoinPage code={joinCode} onDone={handleWelcome} onCancel={clearJoinCode} />
        ) : (
          <WelcomePage onDone={handleWelcome} />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-md mx-auto p-6 pb-32 flex flex-col gap-8">
      {header}

      {error && (
        <p className="rounded-2xl border border-edge bg-fg/5 px-4 py-3 text-sm" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}

      {showInvite && family ? (
        <InvitePage family={family} members={members} onBack={() => setShowInvite(false)} />
      ) : (
        <>
          {tab === "calendar" && (
            <CalendarPage walks={walks} members={members} onDelete={deleteWalk} onInvite={() => setShowInvite(true)} />
          )}
          {tab === "register" && (
            <RegisterPage members={members} currentMemberId={session.memberId} onSave={addWalk} />
          )}
          {tab === "stats" && <StatsPage walks={walks} members={members} />}
        </>
      )}

      <BottomNav active={tab} onChange={changeTab} />
    </main>
  );
}