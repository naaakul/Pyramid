"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { List, LayoutGrid, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { FIELD_CONFIG, useBoardFieldsStore } from "@/store/board-fields-store";
import { Separator } from "../ui/separator";

export function FieldsPopover() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "board";
  const { visible, toggle } = useBoardFieldsStore();

  function setView(next: "list" | "board") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", next);
    router.push(`/tasks?${params.toString()}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="py-1 gap-0 border-ink-border text-ink-text hover:bg-ink-bg hover:text-none">
          <Columns3 size={16} className="mr-1" /> 
          <p className="mb-0.5">Fields</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2">
        <div className="flex rounded-md border border- mb-2 overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5 text-ink-900 ${
              view === "list" && "font-medium bg-secondary border-r"
            }`}
          >
            <List size={14} />
            <p className="mb-0.5">List</p>
          </button>
          {/* <Separator orientation="vertical" className='1-0.5'/> */}

          <button
            onClick={() => setView("board")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-1.5 text-ink-900 ${
              view === "board" && "font-medium bg-secondary border-l"
            }`}
          >
            <LayoutGrid size={14} />
            <p className="mb-0.5">Board</p>
          </button>
        </div>

        <div className="flex flex-col">
          {FIELD_CONFIG.map((field) => (
            <label
              key={field.key}
              className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-50 rounded cursor-pointer"
            >
              {field.label}
              <Checkbox
                checked={visible[field.key]}
                onCheckedChange={() => toggle(field.key)}
              />
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
