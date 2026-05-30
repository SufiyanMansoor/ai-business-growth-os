import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Palette, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme, setTransitioning } from '@/store/slices/themeSlice';
import { applyTheme, themes, ThemeId } from '@/theme/themes';

export default function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((s) => s.theme.current);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleThemeChange = (themeId: ThemeId) => {
    if (themeId === currentTheme) {
      setOpen(false);
      return;
    }

    dispatch(setTransitioning(true));
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay active';
    document.body.appendChild(overlay);

    setTimeout(() => {
      applyTheme(themeId);
      dispatch(setTheme(themeId));
      setTimeout(() => {
        overlay.remove();
        dispatch(setTransitioning(false));
      }, 300);
    }, 150);

    setOpen(false);
  };

  const active = themes.find((t) => t.id === currentTheme);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card hover:!transform-none text-sm"
        aria-label="Switch theme"
      >
        <Palette size={16} style={{ color: 'var(--primary-color)' }} />
        <span className="hidden sm:inline">{active?.icon} {active?.name}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 glass-card p-2 z-50 animate-slide-up shadow-2xl">
          <p className="text-xs px-3 py-2" style={{ color: 'var(--text-muted)' }}>
            Choose Theme
          </p>
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-[var(--card-bg-hover)]"
            >
              <span className="text-xl">{theme.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{theme.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {theme.description}
                </p>
              </div>
              {currentTheme === theme.id && (
                <Check size={16} style={{ color: 'var(--primary-color)' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
