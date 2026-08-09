# Pyramid / Dexter — Task Management System
## Low-Level System Design (Frozen Foundation)

Stack: Next.js (App Router) + Tailwind + shadcn/ui · NestJS · PostgreSQL + Prisma · TypeScript

This doc is meant to be decided once and not revisited mid-build. Everything below — folder
structure, schema, module boundaries, API surface — is designed so that UI polish, animations,
and page-by-page Figma fidelity work can happen *inside* these boundaries without moving files
around later.

---

## 1. Repo Structure (pnpm monorepo)

A monorepo buys you one thing that matters a lot here: **shared enums/types** (Priority, Status,
ThemeMode, ColorMode, DTO shapes) defined once and imported by both the NestJS controllers and
the Next.js client, so the frontend and backend can never drift out of sync on "what does
`priority` mean."

```
pyramid/
├── apps/
│   ├── web/                     # Next.js 14+ App Router
│   └── api/                     # NestJS
├── packages/
│   └── shared/                  # enums, DTO types, zod schemas — imported by both apps
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

`packages/shared` is the one piece of "infra tax" worth paying up front:

```
packages/shared/
├── src/
│   ├── enums.ts        # TaskStatus, Priority, ThemeMode, ColorMode
│   ├── types.ts        # TaskDTO, ProjectDTO, UserDTO, CommentDTO, etc.
│   ├── validation/      # zod schemas reused by NestJS (class-validator alt) and RHF forms
│   └── index.ts
└── package.json
```

If a monorepo feels like too much ceremony for the timebox, the fallback is: keep `apps/web` and
`apps/api` as two repos/folders and hand-duplicate a `types/` folder in each, kept in sync
manually. Mention this trade-off in the README if you take the fallback.

---

## 2. Database Schema (PostgreSQL + Prisma)

Design principles:
- **Subtasks are Tasks.** Page 6/8 show a "Subtasks" table with the exact same columns as the
  main task table (Task, Priority, Members, Due Date, Actions). Rather than a parallel
  `Subtask` model, `Task` self-references via `parentTaskId`. This also means subtasks
  automatically inherit comments, attachments, and activity logging for free.
- **Status is data, not a hardcoded enum of 4 values**, because the board (To Do / Doing /
  Completed / On Hold) and the Details panel ("Backlog") don't agree on the vocabulary in the
  screenshots. Modeling `Status` as a workspace-scoped table with an `order` column lets a
  kanban column and a Details-panel status badge both read from the same source of truth, and
  survives the drag-and-drop reordering requirement for free (`order` doubles as column
  position).
- **Priority stays a Prisma enum** (`NO_PRIORITY, URGENT, HIGH, MEDIUM, LOW`) — it's closed and
  consistent across every screen (task table, subtask table, project table, filter submenu), so
  there's no reason to make it configurable data.
- **Position field on Task** for in-column drag ordering (kanban card order within a status).

```prisma
// packages/db/schema.prisma (or apps/api/prisma/schema.prisma)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────

enum Priority {
  NO_PRIORITY
  URGENT
  HIGH
  MEDIUM
  LOW
}

enum ThemeMode {
  LIGHT
  DARK
}

enum ColorMode {
  AMBER
  BLUE
  PINK
  ROSE
  EMERALD
  BLACK
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
  GUEST
}

enum ActivityType {
  STATUS_CHANGED
  PRIORITY_CHANGED
  ASSIGNEE_ADDED
  ASSIGNEE_REMOVED
  DUE_DATE_CHANGED
  COMMENT_ADDED
  UPDATE_POSTED
}

// ─────────────────────────────────────────────────────────────
// IDENTITY
// ─────────────────────────────────────────────────────────────

model User {
  id           String   @id @default(cuid())
  email        String?  @unique          // null for pure guest users w/ no email captured
  name         String
  username     String?  @unique
  title        String?                    // "Designer", job title shown in Profile page
  avatarColor  String?                    // deterministic color for the fallback colorful avatar
  avatarUrl    String?

  isGuest      Boolean  @default(false)
  googleId     String?  @unique
  passwordHash String?                    // unused if Google/Guest-only, kept for extensibility

  themeMode    ThemeMode  @default(LIGHT)
  colorMode    ColorMode  @default(BLACK)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  memberships       WorkspaceMember[]
  reportedTasks     Task[]            @relation("TaskReporter")
  assignedTasks     TaskAssignee[]
  ledProjects       Project[]         @relation("ProjectLead")
  comments          Comment[]
  activities        Activity[]
  attachmentsAdded  Attachment[]
}

model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  ownerId   String
  createdAt DateTime @default(now())

  members   WorkspaceMember[]
  projects  Project[]
  tasks     Task[]
  labels    Label[]
  teams     Team[]
  statuses  Status[]
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole @default(MEMBER)
  joinedAt    DateTime      @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

// ─────────────────────────────────────────────────────────────
// WORKFLOW CONFIG (per-workspace, drives board columns + badges)
// ─────────────────────────────────────────────────────────────

model Status {
  id          String   @id @default(cuid())
  workspaceId String
  name        String                     // "To Do", "Doing", "Completed", "On Hold", "Backlog"
  color       String   @default("#94a3b8")
  order       Int                        // drives kanban column order left→right

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  tasks       Task[]

  @@unique([workspaceId, name])
  @@index([workspaceId, order])
}

model Label {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  color       String   @default("#64748b")

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  tasks       TaskLabel[]

  @@unique([workspaceId, name])
}

model Team {
  id          String   @id @default(cuid())
  workspaceId String
  name        String

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  tasks       TaskTeam[]

  @@unique([workspaceId, name])
}

// ─────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────

model Project {
  id          String    @id @default(cuid())
  workspaceId String
  name        String
  priority    Priority  @default(NO_PRIORITY)
  leadId      String?
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  lead        User?     @relation("ProjectLead", fields: [leadId], references: [id])
  tasks       Task[]

  @@index([workspaceId])
}

// ─────────────────────────────────────────────────────────────
// TASKS (self-referential for subtasks)
// ─────────────────────────────────────────────────────────────

model Task {
  id           String    @id @default(cuid())
  workspaceId  String
  projectId    String?                    // nullable: tasks can exist outside a project
  parentTaskId String?                    // non-null ⇒ this row IS a subtask
  statusId     String
  reporterId   String

  title        String
  description  String?
  priority     Priority  @default(NO_PRIORITY)
  dueDateStart DateTime?
  dueDateEnd   DateTime?
  position     Float     @default(0)      // fractional index for drag-reorder within a status
  watcherCount Int       @default(0)      // "eye icon · 1" on task detail
  isLocked     Boolean   @default(false)

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  workspace    Workspace   @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  project      Project?    @relation(fields: [projectId], references: [id], onDelete: SetNull)
  status       Status      @relation(fields: [statusId], references: [id])
  reporter     User        @relation("TaskReporter", fields: [reporterId], references: [id])

  parentTask   Task?       @relation("Subtasks", fields: [parentTaskId], references: [id], onDelete: Cascade)
  subtasks     Task[]      @relation("Subtasks")

  assignees    TaskAssignee[]
  labels       TaskLabel[]
  teams        TaskTeam[]
  comments     Comment[]
  attachments  Attachment[]
  activities   Activity[]

  @@index([workspaceId, statusId])
  @@index([projectId])
  @@index([parentTaskId])
}

// join tables (explicit, not implicit many-to-many, so we can add fields like "assignedAt" later
// without a migration that changes relation shape)

model TaskAssignee {
  taskId     String
  userId     String
  assignedAt DateTime @default(now())

  task       Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  user       User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([taskId, userId])
}

model TaskLabel {
  taskId  String
  labelId String

  task    Task  @relation(fields: [taskId], references: [id], onDelete: Cascade)
  label   Label @relation(fields: [labelId], references: [id], onDelete: Cascade)

  @@id([taskId, labelId])
}

model TaskTeam {
  taskId String
  teamId String

  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  team   Team @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@id([taskId, teamId])
}

// ─────────────────────────────────────────────────────────────
// COLLABORATION
// ─────────────────────────────────────────────────────────────

model Comment {
  id        String   @id @default(cuid())
  taskId    String
  authorId  String
  body      String
  createdAt DateTime @default(now())

  task      Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  author    User @relation(fields: [authorId], references: [id])

  @@index([taskId])
}

model Attachment {
  id        String   @id @default(cuid())
  taskId    String
  addedById String
  name      String
  url       String
  type      String?                        // "link" | "file" — kept loose for MVP
  createdAt DateTime @default(now())

  task      Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  addedBy   User @relation(fields: [addedById], references: [id])

  @@index([taskId])
}

model Activity {
  id        String       @id @default(cuid())
  taskId    String
  actorId   String
  type      ActivityType
  fromValue String?
  toValue   String?
  createdAt DateTime     @default(now())

  task      Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  actor     User @relation(fields: [actorId], references: [id])

  @@index([taskId, createdAt])
}
```

**Note on theme persistence:** `themeMode`/`colorMode` live on `User`, not `localStorage` only.
Rationale: the assessment explicitly says "selected theme should persist across page refreshes"
— storing it server-side means it also persists across devices/browsers for a logged-in user,
which is strictly a superset of the requirement. On the client, hydrate an initial value from a
cookie (set at login) to avoid a flash-of-wrong-theme before the API responds; sync to DB on
change via `PATCH /users/me/preferences`.

---

## 3. NestJS Backend — Module Structure

One module per bounded context, each with its own controller/service/dto — no god "tasks"
controller doing double duty for projects.

```
apps/api/src/
├── main.ts
├── app.module.ts
│
├── common/
│   ├── decorators/           # @CurrentUser(), @Workspace()
│   ├── filters/               # HttpExceptionFilter → consistent error shape
│   ├── guards/                # JwtAuthGuard, WorkspaceMemberGuard
│   ├── interceptors/          # TransformInterceptor (envelope { data, meta })
│   └── pipes/                 # ZodValidationPipe (shared schemas from packages/shared)
│
├── config/
│   └── env.validation.ts      # validates DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID at boot
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts      # extends PrismaClient, onModuleInit/onModuleDestroy hooks
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts     # POST /auth/guest, GET /auth/google, GET /auth/google/callback,
│   │                          # POST /auth/logout, GET /auth/me
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── google.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
│
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts    # PATCH /users/me, PATCH /users/me/preferences
│   ├── users.service.ts
│   └── dto/
│
├── workspaces/
│   ├── workspaces.module.ts
│   ├── workspaces.controller.ts   # GET /workspaces/me, POST /workspaces/:id/leave
│   ├── workspaces.service.ts
│   └── dto/
│
├── statuses/                       # workspace-scoped workflow config (board columns)
│   ├── statuses.module.ts
│   ├── statuses.controller.ts
│   └── statuses.service.ts
│
├── labels/
├── teams/
│
├── projects/
│   ├── projects.module.ts
│   ├── projects.controller.ts     # CRUD + GET /projects/:id/tasks
│   ├── projects.service.ts
│   └── dto/
│
├── tasks/
│   ├── tasks.module.ts
│   ├── tasks.controller.ts        # CRUD, GET /tasks?view=board|list&search=&filter=,
│   │                               # PATCH /tasks/:id/position (drag-drop reorder),
│   │                               # GET/POST /tasks/:id/subtasks
│   ├── tasks.service.ts
│   └── dto/
│       ├── create-task.dto.ts
│       ├── update-task.dto.ts
│       └── query-tasks.dto.ts     # search/filter/sort/pagination params, shared shape w/ frontend
│
├── comments/
│   ├── comments.module.ts
│   ├── comments.controller.ts     # nested under /tasks/:taskId/comments
│   └── comments.service.ts
│
├── attachments/
│   ├── attachments.module.ts
│   ├── attachments.controller.ts  # nested under /tasks/:taskId/attachments
│   └── attachments.service.ts
│
└── activity/
    ├── activity.module.ts
    ├── activity.controller.ts     # GET /tasks/:taskId/activity — read-only, written internally
    └── activity.service.ts
```

**Key rule for `activity/`:** nothing calls `ActivityService.log()` directly from a controller.
`TasksService` and `CommentsService` call it internally after a successful mutation (status
change, priority change, assignee add/remove, comment posted). This keeps the "Updates" panel
accurate without every feature module needing to remember to log it.

---

## 4. REST API Surface

All routes prefixed `/api/v1`. All (except `/auth/*`) require `JwtAuthGuard` +
`WorkspaceMemberGuard`, and workspace scoping is enforced server-side (never trust a
`workspaceId` from the client for anything beyond routing — derive membership from the JWT).

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/guest` | Create ephemeral guest user + workspace, return JWT |
| GET | `/auth/google` | Redirect to Google OAuth consent |
| GET | `/auth/google/callback` | Exchange code, upsert User, return JWT |
| POST | `/auth/logout` | Clear session cookie |
| GET | `/auth/me` | Current user + active workspace |
| PATCH | `/users/me` | Update name, title, username, avatar |
| PATCH | `/users/me/preferences` | Update `themeMode` / `colorMode` |
| GET | `/workspaces/me` | Workspace + membership role |
| POST | `/workspaces/:id/leave` | "Leave Workspace" from Profile page |
| GET/POST/PATCH/DELETE | `/statuses` | Board columns config |
| GET/POST/PATCH/DELETE | `/labels` | Label CRUD |
| GET/POST/PATCH/DELETE | `/teams` | Team CRUD |
| GET | `/projects` | List projects (table view) |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Project detail |
| PATCH/DELETE | `/projects/:id` | Update/delete |
| GET | `/projects/:id/tasks` | Tasks scoped to one project (page 12) |
| GET | `/tasks` | `?view=board\|list&search=&status=&priority=&assignee=&projectId=` |
| POST | `/tasks` | Create task (or subtask, via `parentTaskId` in body) |
| GET | `/tasks/:id` | Task detail (includes assignees, labels, subtasks summary) |
| PATCH | `/tasks/:id` | Update any editable field |
| PATCH | `/tasks/:id/position` | `{ statusId, position }` — drag-and-drop move |
| DELETE | `/tasks/:id` | Delete task (cascades subtasks) |
| POST/DELETE | `/tasks/:id/assignees/:userId` | Add/remove assignee |
| GET | `/tasks/:id/comments` | Comment thread |
| POST | `/tasks/:id/comments` | Post comment |
| GET/POST | `/tasks/:id/attachments` | Resources ("Add document or link") |
| GET | `/tasks/:id/activity` | Updates panel feed |

**Search** (`GET /tasks?search=`) is a simple `ILIKE`/`contains` on `title` at MVP scope — page 5
just needs "Design Homepage" to filter down to one row. Full-text search is not warranted by
what the Figma shows.

**Filtering** covers the properties listed on page 11's filter menu: Status, Priority, Members,
Due Date, Teams, Labels, Reporter — all implemented as query params on the same `GET /tasks`
endpoint rather than a separate filter endpoint.

---

## 5. Next.js — App Router Structure

Route groups split the three distinct shells in the Figma: unauthenticated `(auth)`, the main
app shell with sidebar `(app)`, and the separate settings layout `(settings)` (page 13 has its
own back-to-app nav, not the main sidebar).

```
apps/web/src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                 # page 1
│   │
│   ├── (app)/
│   │   ├── layout.tsx                    # persistent sidebar shell (pages 2,4,6,9,12...)
│   │   ├── tasks/
│   │   │   ├── page.tsx                  # board/list toggle via ?view= search param
│   │   │   └── [taskId]/
│   │   │       └── page.tsx              # task detail (page 6/8) — full page, not modal,
│   │   │                                  # since Figma shows it as a routed page w/ its own URL
│   │   └── projects/
│   │       ├── page.tsx                  # page 9/10/11
│   │       └── [projectId]/
│   │           └── page.tsx              # page 12 — reuses task list components, filtered
│   │
│   ├── (settings)/
│   │   └── settings/
│   │       ├── layout.tsx                # left settings nav + "Back to app"
│   │       ├── profile/page.tsx          # page 13
│   │       ├── theme/page.tsx
│   │       └── color/page.tsx
│   │
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts   # only if using NextAuth as a thin proxy to Nest;
│   │                                      # otherwise omit — Nest owns auth entirely
│   ├── layout.tsx                        # root layout, ThemeProvider, font
│   └── globals.css
│
├── components/
│   ├── ui/                               # shadcn primitives (button, popover, dialog, table...)
│   ├── sidebar/
│   │   ├── app-sidebar.tsx
│   │   ├── workspace-switcher.tsx
│   │   └── account-menu.tsx              # Dexter popover → Theme/Color submenus (pages 9/10)
│   ├── tasks/
│   │   ├── board/
│   │   │   ├── kanban-board.tsx
│   │   │   ├── kanban-column.tsx
│   │   │   └── task-card.tsx
│   │   ├── list/
│   │   │   ├── task-list.tsx
│   │   │   ├── task-group.tsx            # collapsible per-status group (page 4)
│   │   │   └── task-row.tsx
│   │   ├── detail/
│   │   │   ├── task-header.tsx
│   │   │   ├── task-properties.tsx
│   │   │   ├── subtasks-table.tsx
│   │   │   ├── comments-thread.tsx
│   │   │   ├── details-panel.tsx
│   │   │   └── updates-panel.tsx
│   │   ├── fields-popover.tsx            # duplicate "Members" row preserved verbatim here
│   │   ├── filter-menu.tsx               # Status/Priority/.../Reporter, w/ Priority submenu
│   │   ├── priority-selector.tsx
│   │   ├── status-selector.tsx
│   │   ├── date-range-picker.tsx         # page 8 calendar
│   │   └── search-bar.tsx                # ⌘F shortcut
│   ├── projects/
│   │   ├── project-table.tsx
│   │   └── project-row.tsx
│   └── shared/
│       ├── avatar-stack.tsx
│       ├── priority-badge.tsx
│       ├── label-pill.tsx
│       ├── date-badge.tsx
│       └── theme-toggle.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts                     # fetch wrapper, attaches JWT, base URL from env
│   │   ├── tasks.ts                      # typed functions, e.g. getTasks(), moveTask()
│   │   ├── projects.ts
│   │   ├── auth.ts
│   │   └── users.ts
│   ├── theme/
│   │   ├── theme-provider.tsx            # reads cookie → applies data-theme/data-color to <html>
│   │   └── theme-cookie.ts
│   └── utils.ts                          # cn(), date formatting, etc.
│
├── hooks/
│   ├── use-tasks.ts                      # react-query wrapper
│   ├── use-task-detail.ts
│   ├── use-debounced-search.ts
│   └── use-keyboard-shortcut.ts          # ⌘F
│
├── store/
│   └── board-dnd-store.ts                # zustand — optimistic drag state before server confirms
│
└── types/
    └── (re-exports from packages/shared, plus any web-only view-model types)
```

Data fetching: **TanStack Query** for all server state (tasks, projects, comments), with
optimistic updates on drag-and-drop (`PATCH /tasks/:id/position`) and on inline edits (priority/
status change from the Details panel). Zustand is scoped narrowly to transient board UI state
(which card is being dragged) — not a general app store, to avoid two sources of truth for the
same task data.

---

## 6. Auth Flow

1. **Guest Login** (`POST /auth/guest`): server creates a `User { isGuest: true }`, a `Workspace`
   owned by that user, a default set of `Status` rows (To Do/Doing/Completed/On Hold) seeded for
   that workspace, and a default `WorkspaceMember { role: GUEST }`. Returns a JWT set as an
   `httpOnly` cookie. No email/password step — matches the Figma exactly (button click → in).
2. **Google Login**: standard Passport Google OAuth2 strategy in Nest; on callback, upsert `User`
   by `googleId`/`email`, create/find their workspace, issue JWT cookie, redirect to
   `/tasks`.
3. **JWT** carries `{ userId, workspaceId }`. `WorkspaceMemberGuard` re-verifies membership per
   request rather than trusting the token blindly for role changes.
4. **Session bootstrap** on the frontend: root layout calls `GET /auth/me` server-side (RSC) to
   avoid a client-side loading flash on every protected route.

---

## 7. What's Explicitly Deferred (document in README, don't build)

To keep the schema "frozen" for the assessment scope, these are modeled loosely on purpose and
should be called out as assumptions rather than silently under-built:
- Multi-workspace switching UI (schema supports `WorkspaceMember` many-to-many, but the sidebar
  only shows one workspace switcher affordance in the screens — build single-active-workspace).
- File upload storage backend for `Attachment.url` — treat as "paste a link" per the "Add
  document or link..." placeholder; wiring S3/UploadThing is out of scope unless required.
- Realtime (WebSocket) updates on the board — screens don't show any live-collaboration cues;
  React Query refetch-on-focus is sufficient.

---

## 8. Suggested Build Order

1. Prisma schema + migrations + seed script (default statuses/labels for a new workspace).
2. Auth module (guest first — unblocks everything else without needing Google OAuth creds set up).
3. Tasks CRUD + board/list views (the core of the assessment's evaluated surface).
4. Projects module + project-detail-as-filtered-task-list.
5. Task detail page (subtasks, comments, activity, details panel).
6. Theme/Color mode + Profile settings.
7. Search, filters, fields popover — polish pass once base data flow works.
8. Responsive pass + animation/interaction polish, README with documented deviations.
