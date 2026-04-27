import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterRestaurantDto } from './dto/register-restaurant.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    private readonly config;
    private readonly prisma;
    constructor(users: UsersService, jwt: JwtService, config: ConfigService, prisma: PrismaService);
    private saltRounds;
    signup(dto: SignupDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
            adminRoleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    registerRestaurant(dto: RegisterRestaurantDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
            adminRoleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
            adminRoleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    private signToken;
}
