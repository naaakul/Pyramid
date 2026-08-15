"use client";

import { ChevronsUpDown } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { CurrentUser } from "@/lib/api/auth";
import { useState } from "react";
import Link from "next/link";
import { Sun, Check, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme/theme-provider";

const COLOR_OPTIONS: {
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

export function WorkspaceSwitcher({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const { themeMode, colorMode, setThemeMode, setColorMode } = useTheme();

  const dynamicOption = {
    ...COLOR_OPTIONS[5],
    label: themeMode === "DARK" ? "White" : "Black",
    swatch: themeMode === "DARK" ? "#fafafa" : "#18181b",
  };
  const displayOptions = [...COLOR_OPTIONS.slice(0, 5), dynamicOption];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild className="outline-0">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-ink-100 outline-0"
            >
              <Avatar className="h-6 w-6 rounded-full overflow-hidden ml-1">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="" height={100} width={100} />
                ) : (
                  // <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xs">
                  <AvatarFallback className="rounded-full bg-ink-900 text-white text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="font-semibold text-nowrap text-ink-900">
                {user.name}
              </span>
              <ChevronsUpDown className="ml-auto h-4 w-4 text-ink-900" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-60 border-ink-border text-ink-900 shadow-ink-100"
          >
            <div className="flex flex-col items-center py-3 mb-1">
              <Avatar className="h-10 w-10 rounded-full mb-2 overflow-hidden">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="" height={100} width={100} />
                ) : (
                  <AvatarFallback
                    className="text-white"
                    style={{ backgroundColor: user.avatarColor ?? "#9ca3af" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium">{user.name}</span>
              {user.email && (
                <span className="text-xs text-ink-500">{user.email}</span>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-1">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="data-[state=open]:bg-ink-bg hover:bg-ink-bg">
                  <Sun size={14} className="mr-2" /> Change Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="ring-ink-border text-ink-900 ">
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setThemeMode("LIGHT");
                    }}
                    className="flex items-center justify-between"
                  >
                    Light {themeMode === "LIGHT" && <Check size={14} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setThemeMode("DARK");
                    }}
                    className="flex items-center justify-between"
                  >
                    Dark {themeMode === "DARK" && <Check size={14} />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="data-[state=open]:bg-ink-bg hover:bg-ink-bg">
                  <span
                    className="w-3.5 h-3.5 rounded mr-2"
                    style={{
                      backgroundColor:
                        dynamicOption.swatch === "#fafafa"
                          ? "#fafafa"
                          : COLOR_OPTIONS.find((o) => o.value === colorMode)
                              ?.swatch,
                    }}
                  />
                  Color Mode
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="border-ink-border text-ink-900 ring-ink-border">
                  {displayOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onSelect={(e) => {
                        e.preventDefault();
                        setColorMode(opt.value);
                      }}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded"
                          style={{ backgroundColor: opt.swatch }}
                        />
                        {opt.label}
                      </span>
                      {colorMode === opt.value && <Check size={14} />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem asChild className="hover:bg-ink-bg">
                <Link href="/settings/profile" className="flex items-center hover:bg-ink-bg">
                  <Settings size={14} className="mr-2" /> Settings
                </Link>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
