import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    return this.prisma.user.update({ where: { id: userId }, data: dto });
  }
}