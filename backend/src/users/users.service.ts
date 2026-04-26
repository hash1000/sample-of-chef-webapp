import { ConflictException, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(params: {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
  }): Promise<User> {
    const existing = await this.findByEmail(params.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        passwordHash: params.passwordHash,
        role: params.role,
        ...(params.role === Role.chef
          ? {
              chefRestaurants: {
                create: {
                  name: `${params.name}'s Kitchen`,
                },
              },
            }
          : {}),
      },
    });
  }

  sanitize(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

