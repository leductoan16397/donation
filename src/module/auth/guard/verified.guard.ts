import { Injectable, CanActivate, ExecutionContext, Inject, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggedUser } from 'src/common/type';
import { KycStatus } from 'src/common/enum';

@Injectable()
export class VerifiedGuard implements CanActivate {
  constructor(@Inject(Reflector.name) private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user: LoggedUser = request.user;

    if (!user) {
      throw new ForbiddenException();
    }

    const isCanActive = user.kycStatus === KycStatus.VERIFIED;

    return isCanActive;
  }
}
