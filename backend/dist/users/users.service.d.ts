import { Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    createUser(params: {
        name: string;
        email: string;
        passwordHash: string;
        role: Role;
    }): Promise<User>;
    sanitize(user: User): {
        name: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        isBlocked: boolean;
        adminRoleId: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}
