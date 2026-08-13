import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }

  async searchByEmail(
    excludeUserId: string,
    email: string,
    taskId?: string,
    projectId?: string,
  ) {
    let excludeIds = [excludeUserId];

    if (taskId) {
      const [assignees, pending] = await Promise.all([
        this.prisma.taskAssignee.findMany({
          where: { taskId },
          select: { userId: true },
        }),
        this.prisma.workspaceInvite.findMany({
          where: { taskId, status: 'PENDING' },
          select: { invitedUserId: true },
        }),
      ]);
      excludeIds.push(
        ...assignees.map((a) => a.userId),
        ...pending.map((p) => p.invitedUserId),
      );
    }
    if (projectId) {
      const [members, pending] = await Promise.all([
        this.prisma.projectMember.findMany({
          where: { projectId },
          select: { userId: true },
        }),
        this.prisma.workspaceInvite.findMany({
          where: { projectId, status: 'PENDING' },
          select: { invitedUserId: true },
        }),
      ]);
      excludeIds.push(
        ...members.map((m) => m.userId),
        ...pending.map((p) => p.invitedUserId),
      );
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

  updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }
}
