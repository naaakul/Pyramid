import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatusesService {
  constructor(private prisma: PrismaService) {}

  findAll(workspaceId: string) {
    return this.prisma.status.findMany({
      where: { workspaceId },
      orderBy: { order: 'asc' },
    });
  }
}