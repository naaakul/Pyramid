"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, User, Sun, Square } from "lucide-react";

const NAV = [
  {
    href: "/settings/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/settings/theme",
    label: "Theme",
    icon: Sun,
  },
  {
    href: "/settings/color",
    label: "Color",
    icon: Square,
  },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r bg-ink-50 flex flex-col">
      <div className="p-4">
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900 mb-4"
        >
          <ArrowLeft size={16} />
          Back to app
        </Link>
      </div>

      <nav className="px-2 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                active
                  ? "bg-ink-100 font-medium"
                  : "text-ink-600 hover:bg-ink-100/60"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}