import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, taskId: string, addedById: string, dto: CreateAttachmentDto) {
    const task = await this.prisma.task.findFirst({ where: { id: taskId, workspaceId } });
    if (!task) throw new NotFoundException('Task not found');
    return this.prisma.attachment.create({ data: { taskId, addedById, ...dto } });
  }

  async remove(workspaceId: string, taskId: string, id: string) {
    const attachment = await this.prisma.attachment.findFirst({ where: { id, taskId, task: { workspaceId } } });
    if (!attachment) throw new NotFoundException('Attachment not found');
    await this.prisma.attachment.delete({ where: { id } });
    return { success: true };
  }
}