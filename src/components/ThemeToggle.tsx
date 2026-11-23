import { useEffect, useState } from "react"; 
import { Sun, Moon } from "lucide-react"; 

type Theme = "light" | "dark"; 

function getStartTheme(): Theme { 
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved; 
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getStartTheme); 

  useEffect(() => { // körs varje gång temat ändras
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme); 
  }, [theme]);

  const isDark = theme === "dark"; 

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")} 
      aria-label={isDark ? "Byt till ljust läge" : "Byt till mörkt läge"} 
      className="relative w-10 h-10 rounded-full border border-edge bg-fg/5 grid place-items-center text-muted hover:text-fg hover:bg-fg/10 transition-colors" 
    >
      <Sun
        size={18} 
        strokeWidth={1.5} 
        className={`absolute transition-all duration-500 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50" 
        }`}
      />
      <Moon
        size={18} 
        strokeWidth={1.5} 
        className={`absolute transition-all duration-500 ${
          isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100" 
        }`}
      />
    </button>
  );
}