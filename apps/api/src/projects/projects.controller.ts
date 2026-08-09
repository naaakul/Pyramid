import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

interface AuthUser {
  userId: string;
  workspaceId: string;
}

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post() create(@CurrentUser() u: AuthUser, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(u.workspaceId, dto);
  }
  @Get(':id') findOne(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.projectsService.findOne(u.workspaceId, id);
  }
  @Patch(':id') update(
    @CurrentUser() u: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(u.workspaceId, id, dto);
  }
  @Delete(':id') remove(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.projectsService.remove(u.workspaceId, id);
  }
  @Get() findAll(@CurrentUser() u: AuthUser, @Query('search') search?: string) {
    return this.projectsService.findAll(u.workspaceId, search);
  }
}
