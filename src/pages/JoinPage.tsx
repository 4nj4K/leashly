import { useEffect, useState } from "react";
import { palette } from "../colors";
import * as api from "../api";
import type { Family, Member } from "../types";
import type { Session } from "../session";

type Props = {
  code: string;
  onDone: (session: Session) => void;
  onCancel: () => void;
};

export default function JoinPage({ code, onDone, onCancel }: Props) {
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getInvite(code)
      .then((data) => {
        setFamily(data.family);
        setMembers(data.members);
        const taken = data.members.map((m) => m.color);
        setColor(palette.find((c) => !taken.includes(c.id))?.id ?? null);
      })
      .catch(() => setNotFound(true));
  }, [code]);

  const takenColors = members.map((m) => m.color);
  const inviter = members[0];
  const avatarColor = color ?? "muted";

  async function join() {
    if (!name.trim()) {
      setError("Skriv ditt namn först.");
      return;
    }
    if (!color) {
      setError("Välj en färg.");
      return;
    }
    setSaving(true);
    try {
      const result = await api.joinFamily(code, name, color);
      onDone({ familyId: result.family.id, memberId: result.member.id });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel.");
      setSaving(false);
    }
  }

  if (notFound) {
    return (
      <section className="flex flex-col items-center text-center gap-6 mt-10">
        <h1 className="font-serif text-4xl">
          Inbjudan hittades <i>inte</i>
        </h1>
        <p className="text-sm text-muted">Kolla att länken är rätt, eller skapa en egen flock.</p>
        <button
          onClick={onCancel}
          className="rounded-full bg-fg text-bg px-6 py-3 text-sm font-medium"
        >
          Skapa en egen flock
        </button>
      </section>
    );
  }

  if (!family) {
    return <p className="text-sm text-muted text-center mt-10">Laddar inbjudan…</p>;
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col items-center text-center gap-5 mt-4">
        <span
          className="w-20 h-20 rounded-full border-[1.5px] grid place-items-center text-3xl font-light transition-all duration-300"
          style={{
            borderColor: `var(--${avatarColor})`,
            color: `var(--${avatarColor})`,
            boxShadow: `0 0 18px color-mix(in srgb, var(--${avatarColor}) 30%, transparent)`,
          }}
        >
          {name.trim() ? name.trim()[0].toUpperCase() : "?"}
        </span>
        <div>
          <p className="text-[11px] tracking-[0.18em] text-muted">DU ÄR INBJUDEN</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">
            {inviter ? inviter.name : "Någon"} vill att du går med i <i>{family.name}</i>
          </h1>
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
          placeholder="Mamma"
          className="bg-transparent border-b border-edge py-2 text-2xl font-light outline-none focus:border-fg/40 transition-colors"
        />
      </label>

      <div className="flex flex-col gap-3">
        <span className="text-[11px] tracking-[0.18em] text-muted">DIN FÄRG</span>
        <div className="flex flex-wrap gap-3">
          {palette.map((c) => {
            const taken = takenColors.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => !taken && setColor(c.id)}
                disabled={taken}
                aria-label={taken ? `${c.label} är tagen` : c.label}
                aria-pressed={color === c.id}
                className="w-10 h-10 rounded-full p-[3px] border transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                style={{ borderColor: color === c.id ? `var(--${c.id})` : "transparent" }}
              >
                <span className="block w-full h-full rounded-full" style={{ background: `var(--${c.id})` }} />
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}

      <button
        onClick={join}
        disabled={saving}
        className="mt-2 w-full rounded-full bg-fg text-bg py-4 text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        {saving ? "Går med…" : "Gå med"}
      </button>
    </section>
  );
}