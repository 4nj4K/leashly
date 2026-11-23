import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import type { Member, Walk } from "../types";
import DayRing from "../components/DayRing";

const monthNames = [
    "Januari", "Februari", "Mars", "April", "Maj", "Juni", 
    "Juli", "Augusti", "September", "Oktober", "November", "December"
];
const weekdays = ["M", "T", "O", "T", "F", "L", "S"];

function toKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarPage({walks, members, onDelete, onInvite }: {walks: Walk[]; members: Member[]; onDelete: (id: number) => void; onInvite: ()=> void }) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selected, setSelected] = useState(
        toKey(today.getFullYear(), today.getMonth(), today.getDate())
    );
    const [confirmId, setConfirmId] = useState<number | null>(null);


const daysInMonth = new Date(year, month + 1, 0).getDate();
const emptyStart = (new Date(year, month, 1).getDay() + 6) % 7; 
const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

function changeMonth(step: number) {
    const newDate = new Date(year, month + step, 1);
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth());
  }

function colorsForDay(day: number) {
    const key = toKey(year, month, day);
    return walks
    .filter((walk) => walk.date === key)
    .sort((a,b) => a.time.localeCompare(b.time))
    .map((walk) => members.find((m) => m.id === walk.memberId)?.color ?? "fg");
}

const selectedWalks = walks
.filter((walk) => walk.date === selected)
.sort((a, b) => a.time.localeCompare(b.time));

const selectedDay = Number(selected.slice(8));

return (
    <section className="flex flex-col gap-6">
        {/* Family */}
        <div className="flex gap-2">
            {members.map((member) => (
                <span
                    key={member.id}
                    title={member.name}
                    className="w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center text-sm"
                    style={{ borderColor: `var(--${member.color})`, color: `var(--${member.color})`}}
                >
                    {member.name[0]}
                </span>
            ))}
            <button onClick={onInvite} aria-label="Bjud in familjemedlem"
                className="w-9 h-9 rounded-full border border-dashed border-muted text-muted flex items-center justify-center hover:text-fg transition-colors"
            >
                <Plus size={16} />
            </button>
        </div>

        {/* Month */}

        <div className="flex justify-between items-end">
            <div>
                <p className="text-[11px] tracking-[0.18em] text-muted">{year}</p>
                <h2 className="font-serif text-4xl leading-none mt-1">
                    <i>{monthNames[month]}</i>
                </h2>
            </div>
            <div className="flex gap-2">
                <button onClick={() => changeMonth(-1)} aria-label="Föregående månad" className="w-9 h-9 rounded-full border border-edge flex items-center justify-center text-muted hover:text-fg">
                    <ChevronLeft size={16} />
                </button>
                <button onClick={() => changeMonth(1)} aria-label="Nästa månad" className="w-9 h-9 rounded-full border border-edge flex items-center justify-center text-muted hover:text-fg">
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-2">
            {weekdays.map((d, i) => (
                <span key = {i} className="text-center text-[11px] tracking-widest text-muted">{d}</span>
            ))}
            {Array.from({ length: emptyStart }).map((_, i) => (
                <span key = {`empty-${i}`} />
            ))}
            {days.map((day) => (
                <DayRing
                    key={day}
                    day={day}
                    colors={colorsForDay(day)}
                    isSelected={selected === toKey(year, month, day)}
                    onClick={() => {
                        setSelected(toKey(year, month, day));
                        setConfirmId(null);
                    }}
                />
            ))}
        </div>

        {/* Chosen day */}
        <div className="rounded-3xl border border-edge bg-surface p-5 flex flex-col gap-3 shadow-[0_6px_20px_rgba(20,22,28,0.06)] dark:shadow-none">
            <div className="flex justify-between items-baseline">
                <span className="font-serif text-xl">
                    {selectedDay} <i>{monthNames[Number(selected.slice(5, 7)) - 1].toLowerCase()}</i>
                </span>
                <span className="text-[11px] tracking-[0.15em] text-muted">
                    {selectedWalks.length} PROMENADER
                </span>
            </div>
            {selectedWalks.length === 0 && (
                <p className="text-sm text-muted">Ingen har gått med Bobby den här dagen.</p>
            )}
            {selectedWalks.map((walk) => { 
                const member = members.find((m) => m.id === walk.memberId); 
                const confirming = confirmId === walk.id; 
                return (
                    <div key={walk.id} className="flex justify-between items-center text-sm"> 
                        <span className="flex items-center gap-3"> 
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: `var(--${member?.color})` }} /> 
                            {member?.name} 
                        </span>
                        <span className="flex items-center gap-3"> 
                            <span className="text-muted tabular-nums">{walk.time}</span> 
                            <button
                                onClick={() => {
                                    if (confirming) { 
                                        onDelete(walk.id); 
                                        setConfirmId(null); 
                                    } else { 
                                        setConfirmId(walk.id); 
                                    }
                                }}
                                aria-label={confirming ? "Bekräfta borttagning" : "Ta bort promenad"} 
                                className="text-xs text-muted hover:text-fg transition-colors"
                                style={confirming ? { color: "var(--coral)" } : undefined} 
                            >
                                {confirming ? "Ta bort?" : <Trash2 size={14} strokeWidth={1.5} />} 
                            </button>
                        </span>
                    </div>
                );
            })}
        </div>
    </section>
    );
}