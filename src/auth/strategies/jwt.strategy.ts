import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mi_clave_secreta_super_segura',
    });
  }

  // The 'payload' is strictly typed, avoiding 'any'
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token inválido');
    }
    // Return the payload so it is injected into the Request object (req.user)
    return { sub: payload.sub, email: payload.email };
  }
}
