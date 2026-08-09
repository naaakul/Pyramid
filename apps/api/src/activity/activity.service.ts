import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  log(taskId: string, actorId: string, type: ActivityType, fromValue?: string | null, toValue?: string | null) {
    return this.prisma.activity.create({
      data: { taskId, actorId, type, fromValue: fromValue ?? undefined, toValue: toValue ?? undefined },
    });
  }
}