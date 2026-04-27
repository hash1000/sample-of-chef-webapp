import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterRestaurantDto } from './dto/register-restaurant.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
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
}
