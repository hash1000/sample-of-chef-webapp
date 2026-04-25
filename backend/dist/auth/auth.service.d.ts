import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    private readonly config;
    constructor(users: UsersService, jwt: JwtService, config: ConfigService);
    private saltRounds;
    signup(dto: SignupDto): Promise<{
        access_token: string;
        user: {
            name: string;
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
            riderStatus: import("@prisma/client").$Enums.RiderStatus | null;
            adminRoleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            name: string;
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
            riderStatus: import("@prisma/client").$Enums.RiderStatus | null;
            adminRoleId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    private signToken;
}
