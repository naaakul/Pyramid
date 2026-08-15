'use client';
import { Check } from 'lucide-react';
import { useTheme } from '@/lib/theme/theme-provider';

export default function ThemeSettingsPage() {
  const { themeMode, setThemeMode } = useTheme();
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-xl font-semibold mb-6 text-ink-900">Theme</h1>
      <div className="border rounded-lg divide-y divide-ink-border border-ink-border">
        {(['LIGHT', 'DARK'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setThemeMode(mode)}
            className="w-full flex items-center justify-between text-ink-text px-4 py-3 text-sm hover:bg-ink-bg"
          >
            {mode === 'LIGHT' ? 'Light' : 'Dark'}
            {themeMode === mode && <Check size={16} />}
          </button>
        ))}
      </div>
    </div>
  );
}