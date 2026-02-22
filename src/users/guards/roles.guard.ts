import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { UserRole } from 'src/utils/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext) {
    const roles: UserRole[] = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);
    
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('Access denied, you are not allowed to access this route');
    }
    
    return true;
  }
}
