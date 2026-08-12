import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }

  async searchByEmail(excludeUserId: string, email: string, taskId?: string) {
    let excludeIds = [excludeUserId];

    if (taskId) {
      const [assignees, pendingInvites] = await Promise.all([
        this.prisma.taskAssignee.findMany({
          where: { taskId },
          select: { userId: true },
        }),
        this.prisma.workspaceInvite.findMany({
          where: { taskId, status: 'PENDING' },
          select: { invitedUserId: true },
        }),
      ]);
      excludeIds = [
        ...excludeIds,
        ...assignees.map((a) => a.userId),
        ...pendingInvites.map((i) => i.invitedUserId),
      ];
    }

    return this.prisma.user.findMany({
      where: {
        email: { contains: email, mode: 'insensitive' },
        id: { notIn: excludeIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarColor: true,
        avatarUrl: true,
      },
      take: 10,
    });
  }
}
