import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }

  async searchByEmail(workspaceId: string, excludeUserId: string, email: string) {
  const existingMemberIds = (
    await this.prisma.workspaceMember.findMany({ where: { workspaceId }, select: { userId: true } })
  ).map((m) => m.userId);

  const pendingInviteUserIds = (
    await this.prisma.workspaceInvite.findMany({
      where: { workspaceId, status: 'PENDING' },
      select: { invitedUserId: true },
    })
  ).map((i) => i.invitedUserId);

  return this.prisma.user.findMany({
    where: {
      email: { contains: email, mode: 'insensitive' },
      id: { notIn: [...existingMemberIds, ...pendingInviteUserIds] },
    },
    select: { id: true, name: true, email: true, avatarColor: true, avatarUrl: true },
    take: 10,
  });
}
}
