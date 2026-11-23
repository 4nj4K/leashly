import { useState } from "react";
import { Flame } from "lucide-react";
import type { Member, Walk } from "../types";

type Period = "week" | "month" | "year";

const periods: { id: Period; label: string }[] = [
    { id: "week", label: "Vecka" },
    { id: "month", label: "Månad" },
    { id: "year", label: "År" },
];

function pad(n: number) { // hjälpfunktion: gör 5 till "05"
    return String(n).padStart(2, "0"); // fyller på med en nolla framför om det behövs
  }

function toKey(d: Date) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getRange(period: Period) {
    const today = new Date();

    if (period === "week") {
        const monday = new Date(today);
        monday.setDate(today.getDate()- ((today.getDay() + 6) %7));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return { start: toKey(monday), end: toKey(sunday), label: "DENNA VECKA" };
    }

    if (period === "month") {
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { start: toKey(first), end: toKey(last), label: "DENA MÅNAD" };
    }

    const year = today.getFullYear();
    return { start: `${year}-01-01`, end: `${year}-12-31`, label: `${year}`};
}

function getStreak(walks: Walk[]) {
    const days = new Set(walks.map((w) => w.date));
    const d = new Date();
    if (!days.has(toKey(d))) d.setDate(d.getDate() - 1);
    let streak = 0;
    while (days.has(toKey(d))) {
        streak++;
        d.setDate(d.getDate() - 1);
    }
    return streak;
}

export default function StatsPage({ walks, members }: { walks: Walk[]; members: Member[]  }) {
    const [period, setPeriod] = useState<Period>("week");

    const range = getRange(period);
    const inPeriod = walks.filter((w) => w.date >= range.start && w.date <= range.end);
    const counts = members.map((m) => inPeriod.filter((w) => w.memberId === m.id).length);
    const most = Math.max(...counts, 1);
    const streak = getStreak(walks);
    const activeIndex = periods.findIndex((p) => p.id === period);

    return (
        <section className="flex flex-col gap-6">

            {/* Title */}
            <div>
                <p className="text-[11px] tracking-[0.18em] text-muted">BOBBYS FLOCK</p>
                <h2 className="font-serif text-4xl leading-none mt-1"><i>Statistik</i></h2>
            </div>

            {/* Rings */}
            <div className="relative h-[290px] grid place-items-center">
                <svg viewBox="0 0 270 270" className="absolute w-[270px] h-[270px] -rotate-90">
                    {members.map((m, i) => {
                        const r = 122 - i * 14;
                        const length = 2 * Math.PI * r;
                        const filled = (counts[i] / (most * 1.12)) * length;
                        return (
                            <g key={m.id}>
                                <circle cx="135" cy="135" r={r} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={2.5} />
                                <circle cx="135" cy="135" r={r} fill="none" stroke={`var(--${m.color})`}
                                strokeWidth={2.5} strokeLinecap="round" strokeDasharray={`${filled} ${length}`}
                                className="transition-[stroke-dasharray] duration-700 ease-out"
                                style={{ filter: `drop-shadow(0 0 3px color-mix(in srgb, var(--${m.color}) 35%, transparent))`}}
                                />
                            </g>
                        );                  
                    })}
                </svg>

                <div className="text-center"> {/* texten i mitten */}
                    <p className="text-7xl font-extralight tracking-tighter leading-none tabular-nums">{inPeriod.length}</p> {/* totalt antal */}
                    <p className="mt-2 text-[11px] tracking-[0.2em] text-muted">PROMENADER · {range.label}</p> {/* t.ex. DENNA VECKA */}
                </div>
            </div>

            {/* Numbers per person */}
            <div className="grid grid-cols-4 gap-2">
                {members.map((m, i) => (
                    <div key={m.id} className="text-center">
                        <p className="text-2xl font-light tabular-nums">{counts[i]}</p>
                        <p className="mt-1 text-[11px] text-muted flex items-center justify-center gap-1.5"> {/* namn med färgprick */}
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: `var(--${m.color})` }} /> {/* färgpricken */}
                            {m.name} {/* namnet */}
                        </p>
                    </div>
                ))}
            </div>

            {/* Streak */}
            <div className="rounded-3xl border border-edge bg-fg/5 px-5 py-4 flex items-center gap-4"> {/* glaskortet */}
                <Flame size={22} strokeWidth={1.5} style={{ color: "var(--orchid)" }} /> {/* flamman */}
                <div>
                    <p className="text-[15px]">{streak} dagar i rad</p> {/* antal dagar */}
                    <p className="text-xs text-muted mt-0.5">Bobby har fått gå varje dag 🐾</p> {/* liten förklaring */}
                </div>
            </div>

            {/* Week / Month / Year */}
            <div className="relative flex rounded-full border border-edge bg-fg/5 p-1"> {/* behållaren för knapparna */}
                <span
                    className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-full bg-fg transition-transform duration-500 ease-out" // den glidande "pillen"
                    style={{ transform: `translateX(${activeIndex * 100}%)` }} // flytta pillen till vald knapp
                 />
                {periods.map((p) => ( // en knapp per period
                    <button
                        key={p.id} // unikt id för React
                        onClick={() => setPeriod(p.id)} // byt period när man trycker
                        aria-pressed={period === p.id} // berättar för skärmläsare vilken som är vald
                        className={`relative flex-1 py-2.5 text-sm rounded-full transition-colors ${
                            period === p.id ? "text-bg" : "text-muted hover:text-fg" // vald knapp får mörk text på ljus pill
                        }`}
                    >
                        {p.label} {/* Vecka, Månad eller År */}
                    </button>
                ))}
            </div>

        </section>
    );
}