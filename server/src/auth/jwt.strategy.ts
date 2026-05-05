import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('JWT validate called with payload:', payload);
    const userId = Number(payload.sub);
    console.log('Converted userId:', userId, 'isInteger:', Number.isInteger(userId));

    if (!Number.isInteger(userId)) {
      console.log('userId is not an integer, throwing 401');
      throw new UnauthorizedException();
    }

    console.log('Querying user with id:', userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log('User lookup result:', user);

    if (!user) {
      console.log('User not found, throwing 401');
      throw new UnauthorizedException();
    }

    console.log('Validation successful, returning user');
    return { id: user.id, email: user.email, name: user.name };
  }
}
