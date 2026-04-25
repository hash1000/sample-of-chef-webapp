import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './types/jwt-payload';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly config;
    private readonly users;
    constructor(config: ConfigService, users: UsersService);
    validate(payload: JwtPayload): Promise<{
        name: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        isBlocked: boolean;
        riderStatus: import("@prisma/client").$Enums.RiderStatus | null;
        adminRoleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
