import { useState } from "react";
import { ArrowLeft, Check, Copy, Share2 } from "lucide-react";
import type { Family, Member } from "../types";

type Props = {
  family: Family;
  members: Member[];
  onBack: () => void;
};

export default function InvitePage({ family, members, onBack }: Props) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const link = `${window.location.origin}/?join=${family.inviteCode}`;
  const canShare = typeof navigator.share === "function";

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFailed(true);
    }
  }

  async function share() {
    try {
      await navigator.share({
        title: "Leashly",
        text: `Gå med i ${family.name} på Leashly 🐾`,
        url: link,
      });
    } catch {
      return;
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <button
        onClick={onBack}
        className="self-start flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Tillbaka
      </button>

      <div>
        <p className="text-[11px] tracking-[0.18em] text-muted">{family.name.toUpperCase()}</p>
        <h2 className="font-serif text-4xl leading-tight mt-1">
          Bjud in din <i>flock</i>
        </h2>
        <p className="text-sm text-muted mt-3">
          Skicka länken, så skriver de in sitt eget namn och väljer en färg.
        </p>
      </div>

      <div className="rounded-3xl border border-edge bg-fg/5 p-5 flex flex-col gap-4">
        <p className="font-mono text-sm break-all select-all">{link}</p>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="flex-1 rounded-full bg-fg text-bg py-3 text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Kopierad" : "Kopiera länk"}
          </button>
          {canShare && (
            <button
              onClick={share}
              aria-label="Dela länken"
              className="w-12 rounded-full border border-edge grid place-items-center text-muted hover:text-fg transition-colors"
            >
              <Share2 size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
        {copyFailed && (
          <p className="text-xs text-muted">Tryck på länken ovanför för att markera den och kopiera själv.</p>
        )}
      </div>

      <div className="text-center">
        <p className="text-[11px] tracking-[0.18em] text-muted">ELLER SKRIV KODEN</p>
        <p className="text-4xl font-extralight tracking-[0.3em] mt-2 tabular-nums">{family.inviteCode}</p>
      </div>

      <div className="flex flex-col">
        <p className="text-[11px] tracking-[0.18em] text-muted mb-2">MEDLEMMAR</p>
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 py-3 border-b border-edge last:border-b-0">
            <span
              className="w-8 h-8 rounded-full border-[1.5px] grid place-items-center text-sm"
              style={{ borderColor: `var(--${m.color})`, color: `var(--${m.color})` }}
            >
              {m.name[0].toUpperCase()}
            </span>
            <span className="text-sm">{m.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}