import { Controller, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

interface AuthUser { userId: string; workspaceId: string; }

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/attachments')
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentsService) {}

  @Post()
  create(@CurrentUser() u: AuthUser, @Param('taskId') taskId: string, @Body() dto: CreateAttachmentDto) {
    return this.attachmentsService.create(u.workspaceId, taskId, u.userId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() u: AuthUser, @Param('taskId') taskId: string, @Param('id') id: string) {
    return this.attachmentsService.remove(u.workspaceId, taskId, id);
  }
}