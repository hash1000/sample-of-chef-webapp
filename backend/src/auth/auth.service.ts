import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RestaurantStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterRestaurantDto } from './dto/register-restaurant.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
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

  async registerRestaurant(dto: RegisterRestaurantDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds());
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash,
        role: Role.chef,
        chefRestaurants: {
          create: {
            name: dto.restaurantName.trim(),
            city: dto.city,
            menuType: dto.menuType.trim(),
            description: dto.description?.trim(),
            status: RestaurantStatus.pending,
            isActive: true,
          },
        },
      },
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

