import { Controller, Patch, Get, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('search')
  search(
    @CurrentUser() u: { userId: string },
    @Query('email') email: string,
    @Query('taskId') taskId?: string,
    @Query('projectId') projectId?: string,
  ) {
    if (!email || email.length < 3) return [];
    return this.usersService.searchByEmail(u.userId, email, taskId, projectId);
  }

  @Patch('me/preferences')
  updatePreferences(
    @CurrentUser() u: { userId: string },
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.usersService.updatePreferences(u.userId, dto);
  }
}
