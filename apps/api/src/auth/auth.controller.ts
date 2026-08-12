import { Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('guest')
  async guest(@Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.createGuestUser();
    res.cookie('token', token, COOKIE_OPTS);
    return { user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect handled by passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const { token } = this.authService.issueToken(
      user.id,
      user.workspaceId,
      user,
    );
    res.cookie('token', token, COOKIE_OPTS);
    res.redirect(`${process.env.FRONTEND_URL}/tasks`);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUser() currentUser: { userId: string; workspaceId: string },
  ) {
    const user = await this.authService.getCurrentUser(currentUser.userId);
    return { ...user, workspaceId: currentUser.workspaceId };
  }
}
