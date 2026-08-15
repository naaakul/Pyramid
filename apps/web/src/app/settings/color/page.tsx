"use client";
import { Check } from "lucide-react";
import { useTheme } from "@/lib/theme/theme-provider";

const COLORS: {
  value: "AMBER" | "BLUE" | "PINK" | "ROSE" | "EMERALD" | "BLACK";
  label: string;
  swatch: string;
}[] = [
  { value: "AMBER", label: "Amber", swatch: "#d97706" },
  { value: "BLUE", label: "Blue", swatch: "#2563eb" },
  { value: "PINK", label: "Pink", swatch: "#db2777" },
  { value: "ROSE", label: "Rose", swatch: "#e11d48" },
  { value: "EMERALD", label: "Emerald", swatch: "#059669" },
  { value: "BLACK", label: "Black", swatch: "#18181b" },
];

export default function ColorSettingsPage() {
  const { colorMode, setColorMode, themeMode } = useTheme();
  const displayColors = COLORS.map((c) =>
    c.value === "BLACK" && themeMode === "DARK"
      ? { ...c, label: "White", swatch: "#fafafa" }
      : c,
  );

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <h1 className="text-xl font-semibold mb-6 text-ink-900">Color</h1>
      <div className="border rounded-lg divide-y divide-ink-border border-ink-border">
        {displayColors.map((c) => (
          <button
            key={c.value}
            onClick={() => setColorMode(c.value)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-ink-bg text-ink-text"
          >
            <span className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded shrink-0"
                style={{ backgroundColor: c.swatch }}
              />
              {c.label}
            </span>
            {colorMode === c.value && <Check size={16} />}
          </button>
        ))}
      </div>
    </div>
  );
}