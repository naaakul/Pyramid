import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('public/tasks')
export class PublicController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: { id: true, title: true, description: true, priority: true, dueDateEnd: true, status: { select: { name: true, color: true } } },
    });
    if (!task) throw new NotFoundException('No task exist');
    return task;
  }
}