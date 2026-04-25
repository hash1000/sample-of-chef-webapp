import { Role } from '@prisma/client';
export declare class SignupDto {
    name: string;
    email: string;
    password: string;
    role: Role;
}
