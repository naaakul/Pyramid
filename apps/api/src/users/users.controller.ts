import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('me/preferences')
  updatePreferences(@CurrentUser() u: { userId: string }, @Body() dto: UpdatePreferencesDto) {
    return this.usersService.updatePreferences(u.userId, dto);
  }
}