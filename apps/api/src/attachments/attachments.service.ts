import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { ActivityType } from '@prisma/client';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService, private activityService: ActivityService) {}

  async create(workspaceId: string, taskId: string, addedById: string, dto: CreateAttachmentDto) {
    const task = await this.prisma.task.findFirst({ where: { id: taskId, workspaceId } });
    if (!task) throw new NotFoundException('Task not found');
    const attachment = await this.prisma.attachment.create({ data: { taskId, addedById, ...dto } });
    await this.activityService.log(taskId, addedById, ActivityType.ATTACHMENT_ADDED, undefined, dto.name);
    return attachment;
  }

  async remove(workspaceId: string, taskId: string, id: string) {
    const attachment = await this.prisma.attachment.findFirst({ where: { id, taskId, task: { workspaceId } } });
    if (!attachment) throw new NotFoundException('Attachment not found');
    await this.prisma.attachment.delete({ where: { id } });
    return { success: true };
  }
}