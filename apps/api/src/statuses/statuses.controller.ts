import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StatusesService } from './statuses.service';

@UseGuards(JwtAuthGuard)
@Controller('statuses')
export class StatusesController {
  constructor(private statusesService: StatusesService) {}

  @Get()
  findAll(@CurrentUser() user: { workspaceId: string }) {
    return this.statusesService.findAll(user.workspaceId);
  }
}