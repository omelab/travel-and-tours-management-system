import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  handleRequest(err: unknown, user: { sub?: string; role?: string; id?: string } | undefined, _info: unknown, context: ExecutionContext) {
    if (err || !user) {
      throw err ?? new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();
    request.headers['x-user-id'] = user.sub ?? user.id ?? '';
    request.headers['x-user-role'] = user.role ?? '';
    return user;
  }
}
