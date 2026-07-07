import { useState, useEffect } from 'react';

export type Theme = 'midnight' | 'cloud' | 'parchment' | 'forest' | 'dawn';

const STORAGE_KEY = 'namaz-theme';
const VALID_THEMES: Theme[] = ['midnight', 'cloud', 'parchment', 'forest', 'dawn'];

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved && VALID_THEMES.includes(saved) ? saved : 'midnight';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Apply on first render synchronously
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { theme, setTheme: setThemeState };
}
