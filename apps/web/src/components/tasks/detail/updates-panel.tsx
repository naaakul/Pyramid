import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ApiActivity } from "@/lib/api/tasks";
import { CollapsibleSection } from "@/components/shared/collapsible-section";
import { useCurrentUser } from '@/lib/auth/current-user-context';

const ACTIVITY_LABEL: Record<string, (a: ApiActivity) => string> = {
  TITLE_CHANGED: (a) => `renamed the task to "${a.toValue}"`,
  DESCRIPTION_CHANGED: () => `updated the description`,
  PRIORITY_CHANGED: (a) =>
    `changed priority from ${a.fromValue ?? "No priority"} to ${a.toValue}`,
  STATUS_CHANGED: () => `changed status`,
  DUE_DATE_CHANGED: () => `updated the due date`,
  ASSIGNEE_ADDED: () => `added a member`,
  ASSIGNEE_REMOVED: () => `removed a member`,
  LABEL_ADDED: () => `added a label`,
  LABEL_REMOVED: () => `removed a label`,
  TEAM_ADDED: (a) => `added team "${a.toValue}"`,
  TEAM_REMOVED: (a) => `removed team "${a.fromValue}"`,
  LOCKED: () => `locked the task`,
  UNLOCKED: () => `unlocked the task`,
  SUBTASK_ADDED: (a) => `added subtask "${a.toValue}"`,
  SUBTASK_DELETED: (a) => `deleted subtask "${a.fromValue}"`,
  ATTACHMENT_ADDED: (a) => `added resource "${a.toValue}"`,
  COMMENT_ADDED: () => `posted a comment`,
};

export function UpdatesPanel({ activities }: { activities: ApiActivity[] }) {
  const currentUser = useCurrentUser();

  return (
    <div className="border rounded-lg p-3 border-ink-border">
      <CollapsibleSection title="Updates">
        <div className="h-96 overflow-y-auto pr-1">
          <div className="space-y-3">
            {activities.length === 0 && (
              <p className="text-xs text-ink-500">No activity yet.</p>
            )}

            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-2 text-xs">
                <Avatar className="h-5 w-5 mt-0.5 shrink-0">
                  <AvatarFallback
                    className="text-[9px] text-white"
                    style={{
                      backgroundColor: a.actor.avatarColor ?? "#9ca3af",
                    }}
                  >
                    {a.actor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <span className="font-medium text-ink-900">
                    {a.actor.id === currentUser.id ? 'You' : a.actor.name}
                  </span>{" "}
                  <span className="text-ink-500">
                    {(ACTIVITY_LABEL[a.type] ?? (() => a.type))(a)}
                  </span>
                  <div className="text-ink-sec mt-0.5">
                    {new Date(a.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
