import { useEffect, useState } from "react";
import type { Walk } from "./data/mockData";
import * as api from "./api";
import ThemeToggle from "./components/ThemeToggle";
import BottomNav, { type Tab } from "./components/BottomNav";
import CalendarPage from "./pages/CalendarPage";
import RegisterPage from "./pages/RegisterPage";
import StatsPage from "./pages/StatsPage";

export default function App() {
  const [tab, setTab] = useState<Tab>("calendar");
  const [walks, setWalks] = useState<Walk[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getWalks()
      .then(setWalks)
      .catch(() => setError("Kunde inte nå servern. Är backenden igång?"));
  }, []);

  async function addWalk(walk: Walk) {
    try {
      const saved = await api.createWalk(walk);
      setWalks([...walks, saved]);
      setTab("calendar");
      setError(null);
    } catch {
      setError("Promenaden kunde inte sparas.");
    }
  }

  async function deleteWalk(id: number) {
    try {
      await api.deleteWalk(id);
      setWalks(walks.filter((w) => w.id !== id));
      setError(null);
    } catch {
      setError("Promenaden kunde inte tas bort.");
    }
  }

  return (
    <main className="min-h-screen max-w-md mx-auto p-6 pb-32 flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <p className="text-[11px] tracking-[0.18em] text-muted">LEASHLY</p>
        <ThemeToggle />
      </header>

      {error && (
        <p className="rounded-2xl border border-edge bg-fg/5 px-4 py-3 text-sm" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}

      {tab === "calendar" && <CalendarPage walks={walks} onDelete={deleteWalk} />}
      {tab === "register" && <RegisterPage onSave={addWalk} />}
      {tab === "stats" && <StatsPage walks={walks} />}

      <BottomNav active={tab} onChange={setTab} />
    </main>
  );
}