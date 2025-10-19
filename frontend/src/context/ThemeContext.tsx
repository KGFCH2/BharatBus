import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
} | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const saved = localStorage.getItem('theme');
            if (saved === 'light' || saved === 'dark') return saved;
        } catch {
            /* ignore */
        }
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        try {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
            }
            localStorage.setItem('theme', theme);
        } catch {
            // ignore
        }
    }, [theme]);

    // Apply persisted 'disableGlows' preference on boot so the global .no-glow class
    // is present even if Navbar hasn't mounted yet.
    useEffect(() => {
        try {
            const d = localStorage.getItem('disableGlows');
            if (d === 'true') document.documentElement.classList.add('no-glow');
            else document.documentElement.classList.remove('no-glow');
        } catch {
            // ignore
        }
    }, []);

    const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
    const setTheme = (t: Theme) => setThemeState(t);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}

// Note: do not export a default non-component value here — keep named exports only
