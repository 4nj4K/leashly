import { useState } from "react";
import { walks as startWalks, type Walk } from "./data/mockData";
import ThemeToggle from "./components/ThemeToggle";
import BottomNav, {type Tab} from "./components/BottomNav";
import CalendarPage from "./pages/CalendarPage";
import RegisterPage from "./pages/RegisterPage";
import StatsPage from "./pages/StatsPage";

export default function App() {
  const [tab, setTab] = useState<Tab>("calendar");
  const [walks, setWalks] = useState<Walk[]>(startWalks);

  function addWalk(walk: Walk) {
    setWalks([...walks, walk]);
    setTab("calendar");
  }

  return (
    <main className="min-h-screen max-w-md mx-auto p-6 pb-32 flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <p className="text-[11px] tracking-[0.18em] text-muted">LEASHLY</p>
        <ThemeToggle />
      </header>

      {tab === "calendar" && <CalendarPage walks={walks} />}
      {tab === "register" && <RegisterPage onSave={addWalk} />}
      {tab === "stats" && <StatsPage/>}

      <BottomNav active={tab} onChange={setTab} />
    </main>
  );
}