import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { MoveTaskDto } from './dto/move-task.dto';

interface AuthUser { userId: string; workspaceId: string; }

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get() findAll(@CurrentUser() u: AuthUser, @Query() q: QueryTasksDto) {
    return this.tasksService.findAll(u.workspaceId, q);
  }
  @Post() create(@CurrentUser() u: AuthUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(u.workspaceId, u.userId, dto);
  }
  @Get(':id') findOne(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.tasksService.findOne(u.workspaceId, id);
  }
  @Patch(':id') update(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(u.workspaceId, id, dto);
  }
  @Patch(':id/position') move(@CurrentUser() u: AuthUser, @Param('id') id: string, @Body() dto: MoveTaskDto) {
    return this.tasksService.move(u.workspaceId, id, dto);
  }
  @Delete(':id') remove(@CurrentUser() u: AuthUser, @Param('id') id: string) {
    return this.tasksService.remove(u.workspaceId, id);
  }
}