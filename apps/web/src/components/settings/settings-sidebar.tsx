"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, User, Sun, Paintbrush, PaintbrushIcon } from "lucide-react";

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
    icon: Paintbrush,
  },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-[16rem] md:shrink-0 border-b md:border-b-0 md:border-r border-ink-border bg-ink-bg flex flex-col">
      <div className="p-4 pb-2 md:pb-4">
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-sm text-ink-900 hover:text-ink-900 mb-2 md:mb-4"
        >
          <ArrowLeft size={16} />
          Back to app
        </Link>
      </div>

      <nav className="flex md:flex-col gap-1 px-2 pb-2 md:pb-0 overflow-x-auto md:overflow-visible">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-ink-900 text-sm whitespace-nowrap shrink-0 md:shrink ${
                active ? "bg-ink-100 font-medium" : "hover:bg-ink-100"
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