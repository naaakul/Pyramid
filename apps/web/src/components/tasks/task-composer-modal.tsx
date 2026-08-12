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

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "subtask" ? "New Subtask" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full text-base border-b pb-2 outline-none mb-3"
        />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="border rounded-full px-2.5 py-1 text-xs">
                <PriorityBadge priority={priority} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className="flex items-center justify-between w-full px-2 py-1.5 text-sm hover:bg-ink-50 rounded"
                >
                  <PriorityBadge priority={p} />
                  {priority === p && <Check size={14} />}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="border rounded-full px-2.5 py-1 text-xs">
                {dueDate
                  ? dueDate.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })
                  : "Due date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
              />
            </PopoverContent>
          </Popover>

          {mode === "task" && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="border rounded-full px-2.5 py-1 text-xs">
                  {status
                    ? statuses?.find((s) => s.id === status)?.name
                    : "Status"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-1">
                {(statuses ?? []).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatus(s.id)}
                    className="flex items-center justify-between w-full px-2 py-1.5 text-sm hover:bg-ink-50 rounded"
                  >
                    {s.name}
                    {status === s.id && <Check size={14} />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          )}

          {mode === "task" && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="border rounded-full px-2.5 py-1 text-xs">
                  Labels {labelIds.length > 0 && `(${labelIds.length})`}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1">
                {(labels ?? []).map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-ink-50 rounded"
                  >
                    <button
                      className="flex-1 text-left flex items-center gap-1.5"
                      onClick={() =>
                        setLabelIds((ids) =>
                          ids.includes(l.id)
                            ? ids.filter((x) => x !== l.id)
                            : [...ids, l.id],
                        )
                      }
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: l.color }}
                      />{" "}
                      {l.name}
                      {labelIds.includes(l.id) && (
                        <Check size={13} className="ml-auto" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        deleteLabel.mutate(l.id);
                        setLabelIds((ids) => ids.filter((x) => x !== l.id));
                      }}
                      className="text-ink-400 hover:text-red-500 ml-1"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-1 border-t mt-1 pt-1 px-1">
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
                    className="flex-1 text-sm px-1 py-1 outline-none"
                  />
                  <button
                    onClick={() =>
                      newLabelName.trim() && createLabel.mutate(newLabelName)
                    }
                    className="text-ink-400 hover:text-ink-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {mode === "subtask" && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="border rounded-full px-2.5 py-1 text-xs">
                  Members {assigneeIds.length > 0 && `(${assigneeIds.length})`}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1">
                {eligibleMembers.length === 0 && (
                  <div className="text-xs text-ink-400 px-2 py-1.5">
                    No eligible members
                  </div>
                )}
                {eligibleMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() =>
                      setAssigneeIds((ids) =>
                        ids.includes(m.id)
                          ? ids.filter((x) => x !== m.id)
                          : [...ids, m.id],
                      )
                    }
                    className="flex items-center justify-between w-full px-2 py-1.5 text-sm hover:bg-ink-50 rounded"
                  >
                    {m.name}
                    {assigneeIds.includes(m.id) && <Check size={14} />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={close}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!title.trim()}
            onClick={submit}
            className="bg-ink-900 text-white hover:bg-ink-700"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
