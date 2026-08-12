import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, invitedById: string, dto: CreateInviteDto) {
    const existing = await this.prisma.workspaceInvite.findFirst({
      where: { workspaceId, invitedUserId: dto.invitedUserId, taskId: dto.taskId ?? null, status: 'PENDING' },
    });
    if (existing) throw new ConflictException('Invite already pending for this user');

    return this.prisma.workspaceInvite.create({
      data: { workspaceId, invitedUserId: dto.invitedUserId, invitedById, taskId: dto.taskId },
      include: { invitedBy: true, task: true },
    });
  }

  findPendingForUser(userId: string) {
    return this.prisma.workspaceInvite.findMany({
      where: { invitedUserId: userId, status: 'PENDING' },
      include: { invitedBy: true, task: true, workspace: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async accept(inviteId: string, userId: string) {
    const invite = await this.prisma.workspaceInvite.findFirst({ where: { id: inviteId, invitedUserId: userId } });
    if (!invite) throw new NotFoundException('Invite not found');
    if (invite.status !== 'PENDING') throw new ConflictException('Invite already resolved');

    await this.prisma.$transaction([
      this.prisma.workspaceInvite.update({
        where: { id: inviteId },
        data: { status: 'ACCEPTED', respondedAt: new Date() },
      }),
      this.prisma.workspaceMember.upsert({
        where: { workspaceId_userId: { workspaceId: invite.workspaceId, userId } },
        create: { workspaceId: invite.workspaceId, userId, role: 'MEMBER' },
        update: {},
      }),
      ...(invite.taskId
        ? [
            this.prisma.taskAssignee.upsert({
              where: { taskId_userId: { taskId: invite.taskId, userId } },
              create: { taskId: invite.taskId, userId },
              update: {},
            }),
          ]
        : []),
    ]);

    return { success: true };
  }
}