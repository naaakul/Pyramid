import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.label.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async create(workspaceId: string, dto: CreateLabelDto) {
    const existing = await this.prisma.label.findFirst({
      where: { workspaceId, name: dto.name },
    });
    if (existing) throw new ConflictException('Label already exists');
    return this.prisma.label.create({
      data: { workspaceId, name: dto.name, color: dto.color ?? '#64748b' },
    });
  }

  async remove(workspaceId: string, id: string) {
    await this.prisma.label.deleteMany({ where: { id, workspaceId } });
    return { success: true };
  }
}
