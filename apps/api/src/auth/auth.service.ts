import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from 'passport-google-oauth20';

const DEFAULT_STATUSES = [
  { name: 'To Do', color: '#94a3b8', order: 0 },
  { name: 'Doing', color: '#3b82f6', order: 1 },
  { name: 'Completed', color: '#22c55e', order: 2 },
  { name: 'On Hold', color: '#f97316', order: 3 },
];

const AVATAR_COLORS = [
  '#f97316',
  '#3b82f6',
  '#22c55e',
  '#a855f7',
  '#ec4899',
  '#eab308',
];

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private randomAvatarColor() {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  }

  private async createWorkspaceForUser(
    userId: string,
    role: 'OWNER' | 'GUEST',
  ) {
    const workspace = await this.prisma.workspace.create({
      data: {
        name: 'My Workspace',
        slug: `ws-${userId.slice(0, 8)}`,
        ownerId: userId,

        members: {
          create: {
            userId,
            role,
          },
        },

        statuses: {
          create: DEFAULT_STATUSES,
        },
      },
    });

    return workspace;
  }

  async createGuestUser() {
    const user = await this.prisma.user.create({
      data: {
        name: `Guest-${Math.floor(Math.random() * 9000 + 1000)}`,
        isGuest: true,
        avatarColor: this.randomAvatarColor(),
      },
    });

    const workspace = await this.createWorkspaceForUser(user.id, 'GUEST');

    const userWithMemberships = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        memberships: true,
      },
    });

    if (!userWithMemberships) {
      throw new Error('Failed to fetch created guest user');
    }

    return this.issueToken(user.id, workspace.id, userWithMemberships);
  }

  async validateGoogleUser(profile: Profile) {
    const email = profile.emails?.[0]?.value;

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: profile.id }, ...(email ? [{ email }] : [])],
      },
      include: {
        memberships: true,
      },
    });

    let user = existing;

    if (!user) {
      const createdUser = await this.prisma.user.create({
        data: {
          googleId: profile.id,
          email,
          name: profile.displayName ?? 'User',
          avatarUrl: profile.photos?.[0]?.value,
          avatarColor: this.randomAvatarColor(),
        },
        include: {
          memberships: true,
        },
      });

      await this.createWorkspaceForUser(createdUser.id, 'OWNER');

      const userWithMemberships = await this.prisma.user.findUnique({
        where: {
          id: createdUser.id,
        },
        include: {
          memberships: true,
        },
      });

      if (!userWithMemberships) {
        throw new Error('Failed to fetch created Google user');
      }

      user = userWithMemberships;
    } else {
      user = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          googleId: profile.id,
          avatarUrl: profile.photos?.[0]?.value ?? null,
        },
        include: {
          memberships: true,
        },
      });
    }

    const membership = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: user.id,
      },
    });

    return {
      ...user,
      workspaceId: membership?.workspaceId,
    };
  }

  issueToken(userId: string, workspaceId: string, user: any) {
    const token = this.jwt.sign({
      sub: userId,
      workspaceId,
    });

    return {
      token,
      user,
    };
  }

  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        memberships: true,
      },
    });
  }
}
