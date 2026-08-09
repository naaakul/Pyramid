import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';

@UseGuards(JwtAuthGuard)
@Controller('labels')
export class LabelsController {
  constructor(private labelsService: LabelsService) {}

  @Get() findAll(@CurrentUser() u: { workspaceId: string }) {
    return this.labelsService.findAll(u.workspaceId);
  }

  @Post() create(@CurrentUser() u: { workspaceId: string }, @Body() dto: CreateLabelDto) {
    return this.labelsService.create(u.workspaceId, dto);
  }
}