import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

function cookieExtractor(req: Request): string | null {
  return req?.cookies?.token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not set in environment variables');
    }

    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: false,
    });
  }

  async validate(payload: { sub: string; workspaceId: string }) {
    return { userId: payload.sub, workspaceId: payload.workspaceId };
  }
}