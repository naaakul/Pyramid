import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  create(
    @CurrentUser() user: { userId: string; workspaceId: string },
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(user.workspaceId, taskId, user.userId, dto.body);
  }
}