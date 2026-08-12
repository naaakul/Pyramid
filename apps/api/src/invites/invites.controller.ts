import { Controller, Get, Post, Param, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';

interface AuthUser { userId: string; workspaceId: string; }

const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax' as const, maxAge: 7 * 24 * 60 * 60 * 1000 };

@UseGuards(JwtAuthGuard)
@Controller('invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Post() create(@CurrentUser() u: AuthUser, @Body() dto: CreateInviteDto) {
    return this.invitesService.create(u.workspaceId, u.userId, dto);
  }
  @Get('me') findMine(@CurrentUser() u: AuthUser) {
    return this.invitesService.findPendingForUser(u.userId);
  }
  @Post(':id/accept')
  async accept(@CurrentUser() u: AuthUser, @Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const { success, token } = await this.invitesService.accept(id, u.userId);
    res.cookie('token', token, COOKIE_OPTS);
    return { success };
  }
}