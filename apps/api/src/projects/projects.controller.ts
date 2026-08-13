import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

interface AuthUser { userId: string; workspaceId: string; }

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get() findAll(@CurrentUser() u: AuthUser, @Query('search') search?: string) {
    return this.projectsService.findAll(u.userId, u.workspaceId, search);
  }
  @Post() create(@CurrentUser() u: AuthUser, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(u.workspaceId, u.userId, dto);
  }
  @Get(':id') findOne(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.projectsService.findOne(u.workspaceId, u.userId, id);
  }
  @Patch(':id') update(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(u.userId, id, dto);
  }
  @Delete(':id') remove(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.projectsService.remove(u.userId, id);
  }
  @Delete(':id/members/:memberId')
  removeMember(@CurrentUser() u: AuthUser, @Param('id') id: string, @Param('memberId') memberId: string) {
    return this.projectsService.removeMember(u.userId, id, memberId);
  }
}