type Props = {
    day: number;
    colors: string[];
    isSelected: boolean;
    onClick: () => void;
}

export default function DayRing({ day, colors, isSelected, onClick }: Props) {
    const step = 360 / colors.length;
    const gap = colors.length > 1 ? 6 : 0;

    const ring = colors
        .map((color, i) => {
            const start = i * step;
            const end = (i + 1) * step;
            return `transparent ${start}deg ${start + gap}deg, var(--${color}) ${start + gap}deg ${end - gap}deg, transparent ${end - gap}deg ${end}deg`;
        })
        .join(", ");

        return (
            <button
              onClick={onClick}
              className="relative block w-full aspect-square rounded-full"
            >
              {colors.length > 0 && (
                <>
                  <span
                    className="absolute inset-0 rounded-full blur-[2px] opacity-0 dark:opacity-35"
                    style={{ background: `conic-gradient(${ring})` }}
                  />
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: `conic-gradient(${ring})` }}
                  />
                </>
              )}
        
              <span className="absolute inset-[1.5px] rounded-full bg-bg" />
        
              {isSelected && (
                <span className="absolute inset-[1.5px] rounded-full bg-fg/10 border border-fg/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
              )}
        
              <span
                className={`absolute inset-0 grid place-items-center text-xs leading-none tabular-nums ${
                  isSelected ? "text-fg font-medium" : "text-fg font-light"
                }`}
              >
                {day}
              </span>
            </button>
          );
        }