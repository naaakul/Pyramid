import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string, workspaceId: string, search?: string) {
    return this.prisma.project.findMany({
      where: {
        OR: [{ workspaceId }, { members: { some: { userId } } }],
        ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      },
      include: { lead: true, members: { include: { user: true } }, _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(workspaceId: string, userId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, OR: [{ workspaceId }, { members: { some: { userId } } }] },
      include: { lead: true, members: { include: { user: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  create(workspaceId: string, creatorId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        workspaceId, name: dto.name, priority: dto.priority,
        leadId: dto.leadId ?? creatorId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: { lead: true, members: { include: { user: true } } },
    });
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.leadId !== userId) throw new ForbiddenException('Only the project lead can edit this project');

    return this.prisma.project.update({
      where: { id },
      data: { ...dto, ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }) },
      include: { lead: true, members: { include: { user: true } } },
    });
  }

  async remove(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.leadId !== userId) throw new ForbiddenException('Only the project lead can delete this project');
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }

  async removeMember(userId: string, projectId: string, memberUserId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.leadId !== userId) throw new ForbiddenException('Only the project lead can remove members');
    await this.prisma.projectMember.deleteMany({ where: { projectId, userId: memberUserId } });
    return { success: true };
  }
}