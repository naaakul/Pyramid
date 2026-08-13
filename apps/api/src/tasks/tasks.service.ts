import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { MoveTaskDto } from './dto/move-task.dto';

const TASK_INCLUDE = {
  status: true,
  assignees: { include: { user: true } },
  labels: { include: { label: true } },
  teams: { include: { team: true } },
  _count: { select: { subtasks: true, comments: true } },
};

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  findAll(userId: string, workspaceId: string, query: QueryTasksDto) {
    return this.prisma.task.findMany({
      where: {
        parentTaskId: null,
        AND: [
          {
            OR: [
              { workspaceId },
              { assignees: { some: { userId } } },
              { project: { members: { some: { userId } } } },
              { project: { leadId: userId } },
            ],
          },
          query.projectId
            ? { projectId: query.projectId }
            : { projectId: null },
          ...(query.search
            ? [
                {
                  title: {
                    contains: query.search,
                    mode: 'insensitive' as const,
                  },
                },
              ]
            : []),
          ...(query.statusId ? [{ statusId: query.statusId }] : []),
          ...(query.priority ? [{ priority: query.priority }] : []),
          ...(query.assigneeId
            ? [{ assignees: { some: { userId: query.assigneeId } } } as const]
            : []),
          ...(query.labelId
            ? [{ labels: { some: { labelId: query.labelId } } } as const]
            : []),
          ...(query.reporterId ? [{ reporterId: query.reporterId }] : []),
          ...(query.dueDate === 'overdue'
            ? [{ dueDateEnd: { lt: new Date() } }]
            : []),
          ...(query.dueDate === 'no_date' ? [{ dueDateEnd: null }] : []),
        ],
      },
      include: TASK_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  async findOne(workspaceId: string, id: string, requesterId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [
          { workspaceId },
          { assignees: { some: { userId: requesterId } } },
          { reporterId: requesterId },
          { project: { members: { some: { userId: requesterId } } } },
          { project: { leadId: requesterId } },
        ],
      },
      include: {
        ...TASK_INCLUDE,
        parentTask: { select: { id: true, title: true } },
        subtasks: { include: TASK_INCLUDE },
        comments: true,
        attachments: true,
        activities: {
          include: { actor: true },
          orderBy: { createdAt: 'desc' },
        },
        invites: {
          where: { status: { not: 'DECLINED' } },
          include: { invitedUser: true },
        },
        watchers: true,
        reporter: true,
      },
    });
    if (!task) throw new NotFoundException('Task not found');

    if (task.parentTaskId) {
      const isReporter = task.reporterId === requesterId;
      const isAssignee = task.assignees.some((a) => a.userId === requesterId);
      if (!isReporter && !isAssignee)
        throw new ForbiddenException('You are not a member of this subtask');
    }
    return task;
  }

  async update(
    workspaceId: string,
    id: string,
    actorId: string,
    dto: UpdateTaskDto,
  ) {
    const existing = await this.prisma.task.findFirst({
      where: { id, workspaceId },
      include: { labels: true },
    });
    if (!existing) throw new NotFoundException('Task not found');

    const { assigneeIds, labelIds, dueDateStart, dueDateEnd, ...rest } = dto;

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        ...(dueDateStart !== undefined && {
          dueDateStart: dueDateStart ? new Date(dueDateStart) : null,
        }),
        ...(dueDateEnd !== undefined && {
          dueDateEnd: dueDateEnd ? new Date(dueDateEnd) : null,
        }),
        ...(assigneeIds && {
          assignees: {
            deleteMany: {},
            create: assigneeIds.map((userId) => ({ userId })),
          },
        }),
        ...(labelIds && {
          labels: {
            deleteMany: {},
            create: labelIds.map((labelId) => ({ labelId })),
          },
        }),
      },
      include: TASK_INCLUDE,
    });

    if (dto.title !== undefined && dto.title !== existing.title) {
      await this.activityService.log(
        id,
        actorId,
        ActivityType.TITLE_CHANGED,
        existing.title,
        dto.title,
      );
    }
    if (
      dto.description !== undefined &&
      dto.description !== existing.description
    ) {
      await this.activityService.log(
        id,
        actorId,
        ActivityType.DESCRIPTION_CHANGED,
      );
    }
    if (dto.priority && dto.priority !== existing.priority) {
      await this.activityService.log(
        id,
        actorId,
        ActivityType.PRIORITY_CHANGED,
        existing.priority,
        dto.priority,
      );
    }
    if (dto.statusId && dto.statusId !== existing.statusId) {
      await this.activityService.log(
        id,
        actorId,
        ActivityType.STATUS_CHANGED,
        existing.statusId,
        dto.statusId,
      );
    }
    if (dueDateStart !== undefined || dueDateEnd !== undefined) {
      await this.activityService.log(
        id,
        actorId,
        ActivityType.DUE_DATE_CHANGED,
      );
    }
    if (dto.isLocked !== undefined && dto.isLocked !== existing.isLocked) {
      await this.activityService.log(
        id,
        actorId,
        dto.isLocked ? ActivityType.LOCKED : ActivityType.UNLOCKED,
      );
    }
    if (labelIds) {
      const oldIds = new Set(existing.labels.map((l) => l.labelId));
      const newIds = new Set(labelIds);
      for (const addedId of newIds)
        if (!oldIds.has(addedId))
          await this.activityService.log(id, actorId, ActivityType.LABEL_ADDED);
      for (const removedId of oldIds)
        if (!newIds.has(removedId))
          await this.activityService.log(
            id,
            actorId,
            ActivityType.LABEL_REMOVED,
          );
    }

    return updated;
  }

  async create(workspaceId: string, reporterId: string, dto: CreateTaskDto) {
    if (dto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });
      if (!project) throw new NotFoundException('Project not found');
      if (project.leadId !== reporterId) {
        throw new ForbiddenException(
          'Only the project lead can create tasks in this project',
        );
      }
    }
    let statusId = dto.statusId;
    if (!statusId) {
      const defaultStatus = await this.prisma.status.findFirst({
        where: { workspaceId },
        orderBy: { order: 'asc' },
      });
      if (!defaultStatus)
        throw new NotFoundException('No statuses configured for workspace');
      statusId = defaultStatus.id;
    }

    if (dto.parentTaskId) {
      const parent = await this.prisma.task.findUnique({
        where: { id: dto.parentTaskId },
      });
      if (parent?.parentTaskId)
        throw new BadRequestException(
          'Subtasks cannot themselves have subtasks',
        );
    }

    const maxPosition = await this.prisma.task.aggregate({
      where: { workspaceId, statusId },
      _max: { position: true },
    });

    const task = await this.prisma.task.create({
      data: {
        workspaceId,
        reporterId,
        statusId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        projectId: dto.projectId,
        parentTaskId: dto.parentTaskId,
        dueDateStart: dto.dueDateStart ? new Date(dto.dueDateStart) : undefined,
        dueDateEnd: dto.dueDateEnd ? new Date(dto.dueDateEnd) : undefined,
        position: (maxPosition._max.position ?? 0) + 1,
        assignees: dto.assigneeIds
          ? { create: dto.assigneeIds.map((userId) => ({ userId })) }
          : undefined,
        labels: dto.labelIds
          ? { create: dto.labelIds.map((labelId) => ({ labelId })) }
          : undefined,
      },
      include: TASK_INCLUDE,
    });

    if (dto.parentTaskId) {
      await this.activityService.log(
        dto.parentTaskId,
        reporterId,
        ActivityType.SUBTASK_ADDED,
        undefined,
        task.title,
      );
    }
    return task;
  }

  async remove(workspaceId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, workspaceId },
    });
    if (!task) throw new NotFoundException('Task not found');
    await this.prisma.task.delete({ where: { id } });
    if (task.parentTaskId) {
      await this.activityService.log(
        task.parentTaskId,
        task.reporterId,
        ActivityType.SUBTASK_DELETED,
        task.title,
      );
    }
    return { success: true };
  }

  async move(workspaceId: string, id: string, dto: MoveTaskDto) {
    await this.ensureExists(workspaceId, id);

    return this.prisma.task.update({
      where: { id },
      data: {
        statusId: dto.statusId,
        position: dto.position,
      },
      include: TASK_INCLUDE,
    });
  }

  private async ensureExists(workspaceId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, workspaceId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
  }

  async addAssignee(
    workspaceId: string,
    taskId: string,
    userId: string,
    actorId: string,
  ) {
    await this.ensureExists(workspaceId, taskId);
    await this.prisma.taskAssignee.upsert({
      where: { taskId_userId: { taskId, userId } },
      create: { taskId, userId },
      update: {},
    });
    await this.activityService.log(
      taskId,
      actorId,
      ActivityType.ASSIGNEE_ADDED,
      undefined,
      userId,
    );
    return this.findOne(workspaceId, taskId, actorId);
  }

  async removeAssignee(
    workspaceId: string,
    taskId: string,
    userId: string,
    actorId: string,
  ) {
    await this.ensureExists(workspaceId, taskId);
    await this.prisma.taskAssignee.deleteMany({ where: { taskId, userId } });
    await this.activityService.log(
      taskId,
      actorId,
      ActivityType.ASSIGNEE_REMOVED,
      userId,
      undefined,
    );
    return this.findOne(workspaceId, taskId, actorId);
  }

  async addTeam(
    workspaceId: string,
    taskId: string,
    teamId: string,
    actorId: string,
  ) {
    await this.ensureExists(workspaceId, taskId);
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    await this.prisma.taskTeam.upsert({
      where: { taskId_teamId: { taskId, teamId } },
      create: { taskId, teamId },
      update: {},
    });
    await this.activityService.log(
      taskId,
      actorId,
      ActivityType.TEAM_ADDED,
      undefined,
      team?.name,
    );
    return this.findOne(workspaceId, taskId, actorId);
  }

  async removeTeam(
    workspaceId: string,
    taskId: string,
    teamId: string,
    actorId: string,
  ) {
    await this.ensureExists(workspaceId, taskId);
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    await this.prisma.taskTeam.deleteMany({ where: { taskId, teamId } });
    await this.activityService.log(
      taskId,
      actorId,
      ActivityType.TEAM_REMOVED,
      team?.name,
    );
    return this.findOne(workspaceId, taskId, actorId);
  }

  async recordView(taskId: string, userId: string) {
    const existing = await this.prisma.taskWatcher.findUnique({
      where: { taskId_userId: { taskId, userId } },
    });
    if (!existing) {
      await this.prisma.$transaction([
        this.prisma.taskWatcher.create({
          data: { taskId, userId, viewedAt: new Date() },
        }),
        this.prisma.task.update({
          where: { id: taskId },
          data: { watcherCount: { increment: 1 } },
        }),
      ]);
    } else if (!existing.viewedAt) {
      await this.prisma.taskWatcher.update({
        where: { id: existing.id },
        data: { viewedAt: new Date() },
      });
    }
  }

  async findAssignees(workspaceId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, workspaceId },
      include: { assignees: { include: { user: true } } },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task.assignees.map((a) => a.user);
  }
}
