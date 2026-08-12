import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';

const COMMENT_INCLUDE = {
  author: true,
  reactions: { include: { user: true } },
  replies: { include: { author: true, reactions: { include: { user: true } } }, orderBy: { createdAt: 'asc' as const } },
};

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService, private activityService: ActivityService) {}

  findForTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId, parentCommentId: null },
      include: COMMENT_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(workspaceId: string, taskId: string, authorId: string, dto: CreateCommentDto) {
    const task = await this.prisma.task.findFirst({ where: { id: taskId, workspaceId } });
    if (!task) throw new NotFoundException('Task not found');

    if (dto.parentCommentId) {
      const parent = await this.prisma.comment.findUnique({ where: { id: dto.parentCommentId } });
      if (!parent) throw new NotFoundException('Parent comment not found');
      if (parent.parentCommentId) throw new BadRequestException('Cannot reply to a reply');
    }

    const comment = await this.prisma.comment.create({
      data: { taskId, authorId, body: dto.body, imageUrl: dto.imageUrl, parentCommentId: dto.parentCommentId },
      include: COMMENT_INCLUDE,
    });
    if (!dto.parentCommentId) {
      await this.activityService.log(taskId, authorId, ActivityType.COMMENT_ADDED);
    }
    return comment;
  }

  async remove(commentId: string, requesterId: string, taskReporterId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== requesterId && requesterId !== taskReporterId) {
      throw new ForbiddenException('Not allowed to delete this comment');
    }
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { success: true };
  }

  async toggleReaction(commentId: string, userId: string, emoji: string) {
    const existing = await this.prisma.commentReaction.findUnique({
      where: { commentId_userId_emoji: { commentId, userId, emoji } },
    });
    if (existing) {
      await this.prisma.commentReaction.delete({ where: { id: existing.id } });
      return { toggled: 'off' };
    }
    await this.prisma.commentReaction.create({ data: { commentId, userId, emoji } });
    return { toggled: 'on' };
  }
}