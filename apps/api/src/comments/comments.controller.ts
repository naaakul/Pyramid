import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

interface AuthUser { userId: string; workspaceId: string; }

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService, private prisma: PrismaService) {}

  @Get() findAll(@Param('taskId') taskId: string) {
    return this.commentsService.findForTask(taskId);
  }

  @Post()
  create(@CurrentUser() u: AuthUser, @Param('taskId') taskId: string, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(u.workspaceId, taskId, u.userId, dto);
  }

  @Delete(':commentId')
  async remove(@CurrentUser() u: AuthUser, @Param('taskId') taskId: string, @Param('commentId') commentId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    return this.commentsService.remove(commentId, u.userId, task!.reporterId);
  }

  @Post(':commentId/reactions/:emoji')
  react(@CurrentUser() u: AuthUser, @Param('commentId') commentId: string, @Param('emoji') emoji: string) {
    return this.commentsService.toggleReaction(commentId, u.userId, decodeURIComponent(emoji));
  }
}