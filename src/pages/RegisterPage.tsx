import { useState } from "react";
import { Check } from "lucide-react";
import type{ Member, NewWalk } from "../types";

type Props = {
  members: Member[];
  currentMemberId: number;
    onSave: (walk: NewWalk) => void;
};

const dayParts = [
    { label: "Morgon", time: "07:30"},
    {label: "Lunch", time: "12:30"},
    {label: "Kväll", time: "18:00"},
    {label: "Natt", time: "22:00"}
];

function pad(n: number) {
    return String(n).padStart(2, "0");
}

function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nowTime() {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function partOfDay(time: string) {
    const hour = Number(time.slice(0, 2));
    if (hour >= 5 && hour < 10) return "Morgon";
    if (hour >= 10 && hour < 15) return "Lunch";
    if (hour >= 15 && hour < 21) return "Kväll";
    return "Natt";
}

export default function RegisterPage({ members, currentMemberId,onSave }: Props) {
    const [who, setWho] = useState(currentMemberId);
    const [date, setDate] = useState(todayKey());
    const [time, setTime] = useState(nowTime());
  
    function save() {
      onSave({ memberId: who, date, time });
    }
    return (
        <section className="flex flex-col gap-8">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-muted">NY PROMENAD</p>
            <h2 className="font-serif text-4xl leading-none mt-1">
              Vem tog <i>Bobby</i>?
            </h2>
          </div>
    
          {/* Vem */}
          <div className="grid grid-cols-4 gap-2">
            {members.map((member) => {
              const selected = member.id === who;
              return (
                <button
                  key={member.id}
                  onClick={() => setWho(member.id)}
                  aria-pressed={selected}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className="w-14 h-14 rounded-full border-[1.5px] grid place-items-center text-xl font-light transition-all duration-300"
                    style={{
                      borderColor: selected ? `var(--${member.color})` : "var(--edge)",
                      color: selected ? `var(--${member.color})` : "var(--muted)",
                      boxShadow: selected ? `0 0 14px color-mix(in srgb, var(--${member.color}) 30%, transparent)` : "none",
                    }}
                  >
                    {member.name[0]}
                  </span>
                  <span className={`text-xs ${selected ? "text-fg" : "text-muted"}`}>
                    {member.name}
                  </span>
                </button>
              );
            })}
          </div>
    
          {/* Tid */}
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="time" className="text-[11px] tracking-[0.18em] text-muted">TID</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent text-6xl font-extralight tracking-tight text-center tabular-nums outline-none dark:[color-scheme:dark]"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Datum"
              className="bg-transparent text-sm text-muted text-center outline-none dark:[color-scheme:dark]"
            />
          </div>
    
          {/* Del av dagen */}
          <div className="flex flex-wrap justify-center gap-2">
            {dayParts.map((part) => {
              const active = partOfDay(time) === part.label;
              return (
                <button
                  key={part.label}
                  onClick={() => setTime(part.time)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    active ? "border-fg/40 bg-fg/10 text-fg" : "border-edge text-muted hover:text-fg"
                  }`}
                >
                  {part.label}
                </button>
              );
            })}
          </div>
    
          <button
            onClick={save}
            className="mt-4 w-full rounded-full bg-fg text-bg py-4 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <Check size={18} />
            Spara promenad
          </button>
        </section>
      );
    }