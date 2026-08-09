import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async create(workspaceId: string, taskId: string, authorId: string, body: string) {
    const task = await this.prisma.task.findFirst({ where: { id: taskId, workspaceId } });
    if (!task) throw new NotFoundException('Task not found');

    const comment = await this.prisma.comment.create({
      data: { taskId, authorId, body },
      include: { author: true },
    });

    await this.activityService.log(taskId, authorId, ActivityType.COMMENT_ADDED);
    return comment;
  }
}