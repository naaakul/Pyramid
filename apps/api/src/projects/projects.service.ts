import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string, search?: string) {
    return this.prisma.project.findMany({
      where: {
        workspaceId,
        ...(search && {
          name: { contains: search, mode: 'insensitive' as const },
        }),
      },
      include: { lead: true, _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(workspaceId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, workspaceId },
      include: { lead: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  create(workspaceId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        workspaceId,
        name: dto.name,
        priority: dto.priority,
        leadId: dto.leadId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: { lead: true },
    });
  }

  async update(workspaceId: string, id: string, dto: UpdateProjectDto) {
    await this.findOne(workspaceId, id);
    return this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
      },
      include: { lead: true },
    });
  }

  async remove(workspaceId: string, id: string) {
    await this.findOne(workspaceId, id);
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }
}
