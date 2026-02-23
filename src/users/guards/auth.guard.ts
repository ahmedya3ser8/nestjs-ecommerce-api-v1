import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';

import { JwtPayload } from 'src/utils/types';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async canActivate(context: ExecutionContext) {
    // 1) check if token exists
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Not authorized, please login to access this route')
    }

    const token = req.headers.authorization.split(' ')[1];
    
    // 2) verify token (invalid or expire)
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET')
      })
    } catch (error) {
      throw new UnauthorizedException('Invalid token, please login to access this route');
    }

    // 3) check if user exists
    const currentUser = await this.userRepository.findOne({ where: { id: payload.id } });
    if (!currentUser) throw new UnauthorizedException('The user belonging to this token no longer exists');

    // 4) check if user active
    if (!currentUser.isActive) {
      throw new BadRequestException('This account is deactivated. Please contact support')
    }

    // 5) check if user change password after token created
    if (currentUser.passwordChangedAt) {
      const passwordChangeTime = Math.floor(currentUser.passwordChangedAt.getTime() / 1000);
      if (passwordChangeTime > payload.iat!) {
        throw new UnauthorizedException('Password was changed recently. Please login again')
      }
    }

    req.user = currentUser;
    return true;
  }
}
