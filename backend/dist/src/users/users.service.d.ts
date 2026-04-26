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
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        isBlocked: boolean;
        adminRoleId: string | null;
    };
}
