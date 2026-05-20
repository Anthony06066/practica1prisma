import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma1 } from '../lib/prisma';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    // Buscar al usuario por email en la base de datos 1
    const user = await prisma1.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado o email incorrecto');
    }

    // Crear el payload tipado
    const payload: JwtPayload = { sub: user.id, email: user.email };

    // Firmar y retornar el token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
