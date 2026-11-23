import { useEffect, useState } from "react";
import type { Member, NewWalk, Walk } from "./types";
import { clearSession, loadSession, saveSession, type Session } from "./session";
import * as api from "./api";
import ThemeToggle from "./components/ThemeToggle";
import BottomNav, { type Tab } from "./components/BottomNav";
import WelcomePage from "./pages/WelcomePage";
import CalendarPage from "./pages/CalendarPage";
import RegisterPage from "./pages/RegisterPage";
import StatsPage from "./pages/StatsPage";

export default function App() {
  const [session, setSession] = useState<Session | null>(loadSession);
  const [tab, setTab] = useState<Tab>("calendar");
  const [members, setMembers] = useState<Member[]>([]);
  const [walks, setWalks] = useState<Walk[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    Promise.all([api.getMembers(session.familyId), api.getWalks(session.familyId)])
      .then(([loadedMembers, loadedWalks]) => {
        if (!loadedMembers.some((m) => m.id === session.memberId)) {
          clearSession();
          setSession(null);
          return;
        }
        setMembers(loadedMembers);
        setWalks(loadedWalks);
        setError(null);
      })
      .catch(() => setError("Kunde inte nå servern. Är backenden igång?"));
  }, [session]);

  function handleWelcome(newSession: Session) {
    saveSession(newSession);
    setSession(newSession);
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
        <WelcomePage onDone={handleWelcome} />
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

      {tab === "calendar" && <CalendarPage walks={walks} members={members} onDelete={deleteWalk} />}
      {tab === "register" && <RegisterPage members={members} currentMemberId={session.memberId} onSave={addWalk} />}
      {tab === "stats" && <StatsPage walks={walks} members={members} />}

      <BottomNav active={tab} onChange={setTab} />
    </main>
  );
}