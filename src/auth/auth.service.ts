import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });
      return this.signToken(user.id, user.email, user.role);
    } catch {
      throw new ForbiddenException('Email déjà utilisé');
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    console.log('User:', user); // ← ici

    if (!user) throw new ForbiddenException('Identifiants invalides');

    const pwMatches = await bcrypt.compare(dto.password, user.password);
    console.log('Password match:', pwMatches); // ← ici aussi

    if (!pwMatches) throw new ForbiddenException('Identifiants invalides');

    return this.signToken(user.id, user.email, user.role);
  }

  async signToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    return { access_token: token };
  }
}
