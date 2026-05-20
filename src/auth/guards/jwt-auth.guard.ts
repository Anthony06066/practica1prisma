import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Add custom authentication logic here if needed
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
    // Override handleRequest to throw custom exceptions
    if (err || !user) {
      throw err || new UnauthorizedException('No tienes permiso para acceder a esta ruta. Por favor, envía un token JWT válido.');
    }
    return user;
  }
}
