import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { JwtPayload } from 'src/utils/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly config: ConfigService) {}

  public async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Not authorized, please login to access this route')
    }

    const token = req.headers.authorization.split(' ')[1];
    
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET')
      })
      req.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token, please login to access this route');
    }    
  }
}
