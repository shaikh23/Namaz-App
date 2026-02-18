import type { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const themes: { id: Theme; color: string; label: string }[] = [
  { id: 'midnight', color: '#f59e0b', label: 'Midnight' },
  { id: 'cloud',    color: '#2563eb', label: 'Cloud'    },
  { id: 'parchment',color: '#92400e', label: 'Parchment'},
];

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <div className="flex gap-2 items-center" role="group" aria-label="Choose theme">
      {themes.map(({ id, color, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          title={label}
          aria-label={`Switch to ${label} theme`}
          aria-pressed={theme === id}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: color,
            outline: theme === id ? `2px solid ${color}` : '2px solid transparent',
            outlineOffset: 3,
            transform: theme === id ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.15s ease, outline 0.15s ease',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}
