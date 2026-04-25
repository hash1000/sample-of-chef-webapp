import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private saltRounds(): number {
    const rounds = Number(this.config.get('BCRYPT_SALT_ROUNDS') ?? 10);
    return Number.isFinite(rounds) && rounds >= 8 ? rounds : 10;
  }

  async signup(dto: SignupDto) {
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds());

    const user = await this.users.createUser({
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: dto.role ?? Role.user,
    });

    const access_token = await this.signToken(user.id, user.role);
    return { access_token, user: this.users.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.signToken(user.id, user.role);
    return { access_token, user: this.users.sanitize(user) };
  }

  private async signToken(userId: string, role: Role) {
    const payload: JwtPayload = { sub: userId, role };
    return this.jwt.signAsync(payload);
  }
}

