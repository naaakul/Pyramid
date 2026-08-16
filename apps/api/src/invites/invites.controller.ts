import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';

interface AuthUser {
  userId: string;
  workspaceId: string;
}

const COOKIE_OPTS = {
  httpOnly: true,
  domain: process.env.COOKIE_DOMAIN,
  sameSite: 'lax' as const,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@UseGuards(JwtAuthGuard)
@Controller('invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Post() create(@CurrentUser() u: AuthUser, @Body() dto: CreateInviteDto) {
    return this.invitesService.create(u.workspaceId, u.userId, dto);
  }
  @Get('me') findMine(
    @CurrentUser() u: AuthUser,
    @Query('type') type?: 'task' | 'project',
  ) {
    return this.invitesService.findPendingForUser(u.userId, type);
  }
  @Post(':id/accept') accept(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
  ) {
    return this.invitesService.accept(id, u.userId);
  }
}
