import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';

@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  findAll(@CurrentUser() u: { workspaceId: string }) {
    return this.teamsService.findAll(u.workspaceId);
  }

  @Post()
  create(@CurrentUser() u: { workspaceId: string }, @Body() dto: CreateTeamDto) {
    return this.teamsService.create(u.workspaceId, dto.name);
  }
}