import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getStartTheme(): Theme {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(getStartTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="byt mellan ljust och mörkt läge"
            className="w-10 h-10 rounded-full border border-edge flex items-center justify-center text-muted hover:text-fg transition-colors"
        >
            {theme === "dark" ? "ljust" : "mörkt"}
        </button>
    );
}