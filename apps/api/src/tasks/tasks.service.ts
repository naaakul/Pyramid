import {
  BadRequestException,
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

  findAll(workspaceId: string, query: QueryTasksDto) {
    return this.prisma.task.findMany({
      where: {
        workspaceId,
        parentTaskId: null,
        ...(query.search && {
          title: { contains: query.search, mode: 'insensitive' as const },
        }),
        ...(query.statusId && { statusId: query.statusId }),
        ...(query.priority && { priority: query.priority }),
        ...(query.projectId && { projectId: query.projectId }),
        ...(query.assigneeId && {
          assignees: { some: { userId: query.assigneeId } },
        }),
        ...(query.labelId && {
          labels: { some: { labelId: query.labelId } },
        }),
        ...(query.reporterId && { reporterId: query.reporterId }),
        ...(query.dueDate === 'overdue' && {
          dueDateEnd: { lt: new Date() },
        }),
        ...(query.dueDate === 'no_date' && { dueDateEnd: null }),
      },
      include: TASK_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  async findOne(workspaceId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, workspaceId },
      include: {
        ...TASK_INCLUDE,
        parentTask: { select: { id: true, title: true } },
        subtasks: { include: TASK_INCLUDE },
        comments: true, // full comment tree now fetched separately via /tasks/:id/comments
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
    return task;
  }

  async create(workspaceId: string, reporterId: string, dto: CreateTaskDto) {
    // Prevent subtasks from having their own subtasks
    if (dto.parentTaskId) {
      const parent = await this.prisma.task.findUnique({
        where: { id: dto.parentTaskId },
      });

      if (parent?.parentTaskId) {
        throw new BadRequestException(
          'Subtasks cannot themselves have subtasks',
        );
      }
    }

    let statusId = dto.statusId;

    if (!statusId) {
      const defaultStatus = await this.prisma.status.findFirst({
        where: { workspaceId },
        orderBy: { order: 'asc' },
      });

      if (!defaultStatus) {
        throw new NotFoundException('No statuses configured for workspace');
      }

      statusId = defaultStatus.id;
    }

    const maxPosition = await this.prisma.task.aggregate({
      where: { workspaceId, statusId },
      _max: { position: true },
    });

    return this.prisma.task.create({
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
          ? {
              create: dto.assigneeIds.map((userId) => ({
                userId,
              })),
            }
          : undefined,

        labels: dto.labelIds
          ? {
              create: dto.labelIds.map((labelId) => ({
                labelId,
              })),
            }
          : undefined,
      },
      include: TASK_INCLUDE,
    });
  }

  async update(
    workspaceId: string,
    id: string,
    actorId: string,
    dto: UpdateTaskDto,
  ) {
    const existing = await this.prisma.task.findFirst({
      where: { id, workspaceId },
    });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

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
            create: assigneeIds.map((userId) => ({
              userId,
            })),
          },
        }),

        ...(labelIds && {
          labels: {
            deleteMany: {},
            create: labelIds.map((labelId) => ({
              labelId,
            })),
          },
        }),
      },
      include: TASK_INCLUDE,
    });

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

    return updated;
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

  async remove(workspaceId: string, id: string) {
    await this.ensureExists(workspaceId, id);

    await this.prisma.task.delete({
      where: { id },
    });

    return { success: true };
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
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
      create: {
        taskId,
        userId,
      },
      update: {},
    });

    await this.activityService.log(
      taskId,
      actorId,
      ActivityType.ASSIGNEE_ADDED,
      undefined,
      userId,
    );

    return this.findOne(workspaceId, taskId);
  }

  async removeAssignee(
    workspaceId: string,
    taskId: string,
    userId: string,
    actorId: string,
  ) {
    await this.ensureExists(workspaceId, taskId);

    await this.prisma.taskAssignee.deleteMany({
      where: {
        taskId,
        userId,
      },
    });

    await this.activityService.log(
      taskId,
      actorId,
      ActivityType.ASSIGNEE_REMOVED,
      userId,
      undefined,
    );

    return this.findOne(workspaceId, taskId);
  }

  async addTeam(workspaceId: string, taskId: string, teamId: string) {
    await this.ensureExists(workspaceId, taskId);
    await this.prisma.taskTeam.upsert({
      where: { taskId_teamId: { taskId, teamId } },
      create: { taskId, teamId },
      update: {},
    });
    return this.findOne(workspaceId, taskId);
  }

  async removeTeam(workspaceId: string, taskId: string, teamId: string) {
    await this.ensureExists(workspaceId, taskId);
    await this.prisma.taskTeam.deleteMany({ where: { taskId, teamId } });
    return this.findOne(workspaceId, taskId);
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
}
