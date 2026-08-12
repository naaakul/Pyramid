import { apiFetch } from "./client";

export interface TaskQuery {
  search?: string;
  statusId?: string;
  priority?: string;
  assigneeId?: string;
  labelId?: string;
  reporterId?: string;
  dueDate?: "overdue" | "no_date";
}

export interface ApiUser {
  id: string;
  name: string;
  avatarColor: string | null;
}

export interface ApiStatus {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface ApiLabel {
  id: string;
  name: string;
  color: string;
}

export interface ApiTask {
  id: string;
  title: string;
  priority: string;
  statusId: string;
  dueDateEnd: string | null;
  assignees: { user: ApiUser }[];
  labels: { label: ApiLabel }[];
}

export interface ApiComment {
  id: string;
  body: string;
  createdAt: string;
  author: ApiUser;
}

export interface ApiActivity {
  id: string;
  type: string;
  fromValue: string | null;
  toValue: string | null;
  createdAt: string;
  actor: ApiUser;
}

export interface ApiTeam {
  id: string;
  name: string;
}

// export interface ApiTaskDetail extends ApiTask {
//   description: string | null;
//   dueDateStart: string | null;
//   parentTaskId: string | null;
//   isLocked: boolean;
//   status: ApiStatus;
//   reporter: ApiUser;
//   teams: { team: ApiTeam }[];
//   subtasks: ApiTask[];
//   comments: ApiComment[];
//   attachments: ApiAttachment[];
//   activities: ApiActivity[];
//   watcherCount: number;
//   parentTask: { id: string; title: string } | null;
// }

// need to watch

export interface ApiTaskDetail extends ApiTask {
  description: string | null;
  dueDateStart: string | null;
  parentTaskId: string | null;
  isLocked: boolean;
  status: ApiStatus;
  reporter: ApiUser;
  teams: { team: ApiTeam }[];
  subtasks: ApiTask[];
  comments: ApiComment[];
  attachments: ApiAttachment[];
  activities: ApiActivity[];
  watcherCount: number;
  parentTask: { id: string; title: string } | null;

  invites: {
    invitedUser: {
      id: string;
    };
    status: string;
  }[];

  watchers: {
    userId: string;
    viewedAt: string | null;
  }[];
}

export interface ApiTeam {
  id: string;
  name: string;
}

export interface ApiLabelFull {
  id: string;
  name: string;
  color: string;
}

export interface ApiAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface ApiCommentReaction {
  emoji: string;
  user: ApiUser;
}

export interface ApiCommentFull {
  id: string;
  body: string;
  imageUrl: string | null;
  createdAt: string;
  author: ApiUser;
  reactions: ApiCommentReaction[];
  replies: ApiCommentFull[];
}

export const getComments = (taskId: string) =>
  apiFetch<ApiCommentFull[]>(`/tasks/${taskId}/comments`);

export const postComment = (
  taskId: string,
  body: string,
  imageUrl?: string,
  parentCommentId?: string,
) =>
  apiFetch<ApiCommentFull>(`/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body, imageUrl, parentCommentId }),
  });

export const deleteComment = (taskId: string, commentId: string) =>
  apiFetch(`/tasks/${taskId}/comments/${commentId}`, { method: "DELETE" });

export const toggleReaction = (
  taskId: string,
  commentId: string,
  emoji: string,
) =>
  apiFetch(
    `/tasks/${taskId}/comments/${commentId}/reactions/${encodeURIComponent(emoji)}`,
    { method: "POST" },
  );

export const getTask = (id: string) => apiFetch<ApiTaskDetail>(`/tasks/${id}`);

export const updateTask = (
  id: string,
  data: Partial<{
    priority: string;
    statusId: string;
    title: string;
    description: string;
    dueDateStart: string | null;
    dueDateEnd: string | null;
    labelIds: string[];
    isLocked: boolean;
  }>,
) =>
  apiFetch<ApiTask>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const addComment = (taskId: string, body: string) =>
  apiFetch<ApiComment>(`/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });

export const createTask = (data: {
  title: string;
  statusId?: string;
  parentTaskId?: string;
}) =>
  apiFetch<ApiTask>("/tasks", { method: "POST", body: JSON.stringify(data) });

export const getStatuses = () => apiFetch<ApiStatus[]>("/statuses");

export const getTasks = (query: TaskQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return apiFetch<ApiTask[]>(`/tasks${qs ? `?${qs}` : ""}`);
};

export const getTeams = () => apiFetch<ApiTeam[]>("/teams");

export const moveTask = (
  id: string,
  data: { statusId: string; position: number },
) =>
  apiFetch<ApiTask>(`/tasks/${id}/position`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getLabels = () => apiFetch<ApiLabelFull[]>("/labels");
export const createLabel = (name: string) =>
  apiFetch<ApiLabelFull>("/labels", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const getWorkspaceMembers = () =>
  apiFetch<ApiUser[]>("/workspaces/members");

export const addAssignee = (taskId: string, userId: string) =>
  apiFetch<ApiTask>(`/tasks/${taskId}/assignees/${userId}`, { method: "POST" });
export const removeAssignee = (taskId: string, userId: string) =>
  apiFetch<ApiTask>(`/tasks/${taskId}/assignees/${userId}`, {
    method: "DELETE",
  });

export const createTeam = (name: string) =>
  apiFetch<ApiTeam>("/teams", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const addTaskTeam = (taskId: string, teamId: string) =>
  apiFetch(`/tasks/${taskId}/teams/${teamId}`, { method: "POST" });

export const removeTaskTeam = (taskId: string, teamId: string) =>
  apiFetch(`/tasks/${taskId}/teams/${teamId}`, { method: "DELETE" });

export const createAttachment = (
  taskId: string,
  data: { name: string; url: string; type: "link" | "file" },
) =>
  apiFetch<ApiAttachment>(`/tasks/${taskId}/attachments`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteAttachment = (taskId: string, id: string) =>
  apiFetch(`/tasks/${taskId}/attachments/${id}`, { method: "DELETE" });

export const getTaskAssignees = (taskId: string) =>
  apiFetch<ApiUser[]>(`/tasks/${taskId}/assignees`);
