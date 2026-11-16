import ThemeToggle from "./components/ThemeToggle";

const colors = ["orchid", "pink", "coral", "gold", "lime", "mint", "sky", "blue"];

export default function App() {
  return (
    <main className="min-h-screen p-6 flex flex-col gap-8">
      <header className="flex justify-between itmes-start">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-muted">LEASHLY</p>
          <h1 className="font-serif text-4xl mt-1">
            Vem gick med <i>hunden</i>
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="felx gap-3">
        {colors.map((color) => (
          <span
          key={color}
          className="w-8 h-8 rounded-full"
          style={{background: `var(--${color})`}}
          />
        ))}
      </div>
    </main>
  );
}