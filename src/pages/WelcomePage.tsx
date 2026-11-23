import { useState } from "react";
import { palette } from "../colors";
import * as api from "../api";
import type { Session } from "../session";

export default function WelcomePage({ onDone }: { onDone: (session: Session) => void }) {
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [color, setColor] = useState(palette[0].id);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!name.trim()) {
      setError("Skriv ditt namn först.");
      return;
    }
    setSaving(true);
    try {
      const { family, member } = await api.createFamily(familyName, name, color);
      onDone({ familyId: family.id, memberId: member.id });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel.");
      setSaving(false);
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col items-center text-center gap-5 mt-4">
        <span
          className="w-20 h-20 rounded-full border-[1.5px] grid place-items-center text-3xl font-light transition-all duration-300"
          style={{
            borderColor: `var(--${color})`,
            color: `var(--${color})`,
            boxShadow: `0 0 18px color-mix(in srgb, var(--${color}) 30%, transparent)`,
          }}
        >
          {name.trim() ? name.trim()[0].toUpperCase() : "?"}
        </span>
        <div>
          <p className="text-[11px] tracking-[0.18em] text-muted">VÄLKOMMEN TILL LEASHLY</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">
            Skapa din <i>flock</i>
          </h1>
          <p className="text-sm text-muted mt-3">Sen bjuder du in resten av familjen.</p>
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.18em] text-muted">DITT NAMN</span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="Anja"
          className="bg-transparent border-b border-edge py-2 text-2xl font-light outline-none focus:border-fg/40 transition-colors"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.18em] text-muted">FLOCKENS NAMN</span>
        <input
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder="Bobbys flock"
          className="bg-transparent border-b border-edge py-2 text-2xl font-light outline-none focus:border-fg/40 transition-colors"
        />
      </label>

      <div className="flex flex-col gap-3">
        <span className="text-[11px] tracking-[0.18em] text-muted">DIN FÄRG</span>
        <div className="flex flex-wrap gap-3">
          {palette.map((c) => (
            <button
              key={c.id}
              onClick={() => setColor(c.id)}
              aria-label={c.label}
              aria-pressed={color === c.id}
              className="w-10 h-10 rounded-full p-[3px] border transition-colors"
              style={{ borderColor: color === c.id ? `var(--${c.id})` : "transparent" }}
            >
              <span className="block w-full h-full rounded-full" style={{ background: `var(--${c.id})` }} />
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}

      <button
        onClick={create}
        disabled={saving}
        className="mt-2 w-full rounded-full bg-fg text-bg py-4 text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {saving ? "Skapar…" : "Skapa flock"}
      </button>
    </section>
  );
}