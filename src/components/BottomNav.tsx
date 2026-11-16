import { CalendarDays, Plus, ChartColumn } from "lucide-react";

export type Tab = "calendar" | "register" | "stats";

type Props = {
    active: Tab;
    onChange: (tab: Tab) => void;
};

export default function BottomNav({ active, onChange }: Props) {
    const tabClass = (tab: Tab) => 
        `flex flex-col items-center gap-1 text-[11px] transition-colors ${
            active === tab ? "text-fg" : "text-muted hover:text-fg"
        }`;

    return (
        <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-sm flex items-center justify-between rounded-full border border-edge bg-surface/70 backdrop-blur-xl px-8 py-2">
            <button onClick={() => onChange("calendar")} className={tabClass("calendar")}>
                <CalendarDays size={20} strokeWidth={1.5} />
                Kalender
            </button>

            <button onClick={() => onChange("register")}
                aria-label="Registrera promenad"
                className="w-14 h-14 rounded-full bg-fg text-bg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                    <Plus size={24} />
            </button>

            <button onClick={() => onChange("stats")} className={tabClass("stats")}>
                <ChartColumn size={20} strokeWidth={1.5} />
                Statisik
            </button>
        </nav>
    );
}