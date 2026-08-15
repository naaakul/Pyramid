"use client";

import { useState } from "react";
import { Check, X, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "./shared/priority-badge";

import { useTaskComposerStore } from "@/store/task-composer-store";

import {
  useLabels,
  useCreateLabel,
  useDeleteLabel,
  useStatuses,
  useCreateTask,
  useCreateSubtask,
  useWorkspaceMembers,
  useTaskDetail,
  useTaskAssignees,
} from "@/hooks/use-tasks";

const PRIORITIES = ["NO_PRIORITY", "URGENT", "HIGH", "MEDIUM", "LOW"];

const FIELD_TRIGGER =
  "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-ink-border bg-white px-3 text-sm text-ink-700 transition-colors hover:border-ink-300 hover:bg-ink-50/50";

const LABEL_WIDTH = "w-[68px] shrink-0";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={`${LABEL_WIDTH} shrink-0 whitespace-nowrap text-sm text-ink-500`}
    >
      {children}
    </span>
  );
}

function Chevron() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      className="shrink-0 text-ink-400"
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TaskComposerModal() {
  const { isOpen, mode, statusId, projectId, parentTaskId, close } =
    useTaskComposerStore();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("NO_PRIORITY");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [labelIds, setLabelIds] = useState<string[]>([]);
  const [status, setStatus] = useState(statusId ?? "");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [newLabelName, setNewLabelName] = useState("");

  const { data: labels } = useLabels();
  const { data: statuses } = useStatuses();
  const { data: workspaceMembers } = useWorkspaceMembers();
  const { data: parentTask } = useTaskDetail(parentTaskId ?? "");

  const createLabel = useCreateLabel();
  const deleteLabel = useDeleteLabel();
  const createTask = useCreateTask();
  const createSubtask = useCreateSubtask(parentTaskId ?? "");

  const { data: parentAssignees } = useTaskAssignees(parentTaskId ?? "");

  const eligibleMembers =
    mode === "subtask" ? (parentAssignees ?? []) : (workspaceMembers ?? []);

  function reset() {
    setTitle("");
    setPriority("NO_PRIORITY");
    setDueDate(undefined);
    setLabelIds([]);
    setStatus(statusId ?? "");
    setAssigneeIds([]);
    setNewLabelName("");
  }

  function submit() {
    if (!title.trim()) return;

    if (mode === "subtask") {
      createSubtask.mutate(
        {
          title,
          priority,
          dueDateEnd: dueDate?.toISOString(),
          assigneeIds,
        } as never,
        {
          onSuccess: () => {
            reset();
            close();
          },
        },
      );
    } else {
      createTask.mutate(
        {
          title,
          priority,
          statusId: status || undefined,
          projectId,
          dueDateEnd: dueDate?.toISOString(),
          labelIds,
        } as never,
        {
          onSuccess: () => {
            reset();
            close();
          },
        },
      );
    }
  }

  const selectedStatus = statuses?.find((s) => s.id === status);

  function toggleLabel(id: string) {
    setLabelIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-[500px]
          overflow-hidden
          rounded-2xl
          border
          border-ink-border
          bg-white
          p-0
          ring-0
          [&>button]:hidden
        "
      >
        <DialogHeader className="px-6 py-5 ">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-ink-900">
                {mode === "subtask" ? "New Subtask" : "New Task"}
              </DialogTitle>

              {mode === "subtask" && parentTask && (
                <p className="mt-1 truncate text-xs text-ink-400">
                  Under &quot;{parentTask.title}&quot;
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={close}
              className="
                ml-4
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-md
                text-ink-400
                transition-colors
                hover:bg-ink-50
                hover:text-ink-700
              "
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-3 px-6 ">
          <div className="flex min-w-0 items-center gap-3">
            <FieldLabel>Title</FieldLabel>

            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && title.trim()) {
                  submit();
                }
              }}
              placeholder="Name the task"
              className="
                h-10
                min-w-0
                flex-1
                rounded-lg
                border
                border-ink-border
                bg-white
                px-3
                text-sm
                text-ink-900
                outline-none
                transition-colors
                placeholder:text-ink-sec
                focus:border-ink-400
                focus:ring-2
                focus:ring-ink-100
              "
            />
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <FieldLabel>Priority</FieldLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={FIELD_TRIGGER}>
                    <span className="min-w-0 truncate">
                      <PriorityBadge priority={priority} />
                    </span>

                    <Chevron />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className="w-44 rounded-xl border border-ink-border bg-white p-1 shadow-lg"
                >
                  {PRIORITIES.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-md
                        px-2
                        py-2
                        text-sm
                        hover:bg-ink-50
                      "
                    >
                      <PriorityBadge priority={p} />

                      {priority === p && <Check size={14} />}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <FieldLabel>Due Date</FieldLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={FIELD_TRIGGER}>
                    <span
                      className={`min-w-0 truncate ${
                        dueDate ? "text-ink-700" : "text-ink-sec"
                      }`}
                    >
                      {dueDate
                        ? dueDate.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "Due date"}
                    </span>

                    <Chevron />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className="w-auto rounded-xl border border-ink-border bg-white p-0 shadow-lg"
                >
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <FieldLabel>{mode === "task" ? "Status" : "Members"}</FieldLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={FIELD_TRIGGER}>
                    <span
                      className={`min-w-0 truncate ${
                        mode === "task"
                          ? status
                            ? "text-ink-700"
                            : "text-ink-sec"
                          : assigneeIds.length
                            ? "text-ink-700"
                            : "text-ink-sec"
                      }`}
                    >
                      {mode === "task"
                        ? selectedStatus?.name || "Status"
                        : assigneeIds.length
                          ? `${assigneeIds.length} selected`
                          : "Members"}
                    </span>

                    <Chevron />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  sideOffset={6}
                  className="w-48 rounded-xl border border-ink-border bg-white p-1 shadow-lg"
                >
                  {mode === "task" ? (
                    <>
                      {(statuses ?? []).map((s) => (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => setStatus(s.id)}
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-md
                            px-2
                            py-2
                            text-left
                            text-sm
                            hover:bg-ink-bg
                            text-ink-text
                          "
                        >
                          <span className="truncate">{s.name}</span>

                          {status === s.id && <Check size={14} />}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {eligibleMembers.length === 0 && (
                        <div className="px-2 py-2 text-xs text-ink-400">
                          No eligible members
                        </div>
                      )}

                      {eligibleMembers.map((m) => (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() =>
                            setAssigneeIds((ids) =>
                              ids.includes(m.id)
                                ? ids.filter((x) => x !== m.id)
                                : [...ids, m.id],
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-md
                            px-2
                            py-2
                            text-left
                            text-sm
                            hover:bg-ink-50
                          "
                        >
                          <span className="truncate">{m.name}</span>

                          {assigneeIds.includes(m.id) && <Check size={14} />}
                        </button>
                      ))}
                    </>
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {mode === "task" && (
              <div className="flex min-w-0 items-center gap-3">
                <FieldLabel>Labels</FieldLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className={FIELD_TRIGGER}>
                      <span
                        className={`min-w-0 truncate ${
                          labelIds.length ? "text-ink-700" : "text-ink-sec"
                        }`}
                      >
                        {labelIds.length
                          ? `${labelIds.length} selected`
                          : "Labels"}
                      </span>

                      <Chevron />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    sideOffset={6}
                    className="w-64 rounded-xl border border-ink-border bg-white p-3 shadow-lg gap-0"
                  >
                    <div className="flex flex-wrap gap-2 ">
                      {(labels ?? []).map((l) => {
                        const selected = labelIds.includes(l.id);
                        return (
                          <button
                            type="button"
                            key={l.id}
                            onClick={() => toggleLabel(l.id)}
                            className={`
                              relative
                              flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-3
                              pb-0.5
                              text-sm
                              transition-colors
                              ${
                                selected
                                  ? "border-blue-300 bg-blue-100 text-blue-900"
                                  : "border-transparent bg-blue-50 text-blue-700 hover:bg-blue-100"
                              }
                            `}
                          >
                            <span className="truncate">{l.name}</span>

                            {/* Every pill gets an x, regardless of
                                selection state — this permanently deletes
                                the label from the workspace. Clicking the
                                pill body itself (not the x) toggles
                                selection. */}
                            <span
                              role="button"
                              tabIndex={-1}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLabel.mutate(l.id);
                                setLabelIds((ids) =>
                                  ids.filter((x) => x !== l.id),
                                );
                              }}
                              className="
                                absolute
                                -right-1
                                -top-1
                                flex
                                h-4
                                w-4
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-blue-300
                                bg-white
                                text-blue-600
                                hover:border-red-300
                                hover:bg-red-50
                                hover:text-red-500
                              "
                            >
                              <X size={9} />
                            </span>
                          </button>
                        );
                      })}

                      {(labels ?? []).length === 0 && (
                        <div className="px-1 py-1 text-xs text-ink-400">
                          No labels yet
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 border-ink-border">
                      <input
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newLabelName.trim()) {
                            createLabel.mutate(newLabelName);
                            setNewLabelName("");
                          }
                        }}
                        placeholder="New label..."
                        className="
                          h-9
                          min-w-0
                          flex-1
                          rounded-lg
                          border
                          border-ink-border
                          bg-white
                          px-3
                          text-sm
                          outline-none
                          focus:border-ink-400
                          placeholder:text-ink-sec
                          text-ink-text
                        "
                      />

                      <Button
                        type="button"
                        size="sm"
                        disabled={!newLabelName.trim()}
                        onClick={() => {
                          if (!newLabelName.trim()) return;
                          createLabel.mutate(newLabelName);
                          setNewLabelName("");
                        }}
                        className="h-9 rounded-lg bg-ink-900 px-4 text-white hover:bg-ink-700 disabled:opacity-55"
                      >
                        Add
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        <DialogFooter
          className="
            gap-2
            px-10
            bg-transparent border-t-0
            pb-10
          "
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={close}
            className="h-9 rounded-lg border-ink-border text-ink-text bg-white px-4 hover:bg-ink-bg hover:text-none"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={!title.trim()}
            onClick={submit}
            className="
              h-9
              rounded-lg
              bg-ink-900
              px-5
              text-white
              hover:bg-ink-700
              disabled:opacity-55
            "
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}