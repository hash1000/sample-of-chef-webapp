import { PrismaService } from '../prisma/prisma.service';
import { AdminOrdersFilterDto } from './dto/orders-filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurants.dto';
import { AssignPermissionsToRoleDto, AssignRoleToUserDto, CreateAdminRoleDto, CreatePermissionDto } from './dto/roles-permissions.dto';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    dashboard(): Promise<{
        totalUsers: number;
        totalRestaurants: number;
        totalOrders: number;
        totalRevenue: number;
    }>;
    listUsers(query: PaginationDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            name: string;
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
            createdAt: Date;
        }[];
    }>;
    blockUser(userId: string, blocked?: boolean): Promise<{
        id: string;
        isBlocked: boolean;
    }>;
    deleteUser(userId: string): Promise<{
        ok: boolean;
    }>;
    createRestaurant(dto: CreateRestaurantDto): Promise<{
        name: string;
        chefId: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
    }>;
    listRestaurants(query: PaginationDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            chef: {
                name: string;
                email: string;
                id: string;
            } | null;
        } & {
            name: string;
            chefId: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
        })[];
    }>;
    updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<{
        chef: {
            name: string;
            email: string;
            id: string;
        } | null;
    } & {
        name: string;
        chefId: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
    }>;
    deleteRestaurant(id: string): Promise<{
        ok: boolean;
    }>;
    listOrders(query: PaginationDto, filter: AdminOrdersFilterDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
            restaurant: {
                name: string;
                id: string;
            } | null;
            payment: {
                status: import("@prisma/client").$Enums.PaymentStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderId: string;
                provider: string;
                stripeIntentId: string | null;
                amount: number;
                currency: string;
            } | null;
            items: {
                name: string;
                id: string;
                orderId: string;
                quantity: number;
                unitPrice: number;
                lineTotal: number;
            }[];
        } & {
            status: import("@prisma/client").$Enums.OrderStatus;
            userId: string;
            total: number;
            subtotal: number;
            deliveryFee: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string | null;
        })[];
    }>;
    getOrder(id: string): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
        restaurant: {
            name: string;
            id: string;
        } | null;
        payment: {
            status: import("@prisma/client").$Enums.PaymentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            provider: string;
            stripeIntentId: string | null;
            amount: number;
            currency: string;
        } | null;
        items: {
            name: string;
            id: string;
            orderId: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
        }[];
    } & {
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string;
        total: number;
        subtotal: number;
        deliveryFee: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string | null;
    }>;
    createAdminRole(dto: CreateAdminRoleDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listAdminRoles(): Promise<({
        permissions: ({
            permission: {
                key: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            roleId: string;
            id: string;
            createdAt: Date;
            permissionId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createPermission(dto: CreatePermissionDto): Promise<{
        key: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assignRoleToUser(dto: AssignRoleToUserDto): Promise<{
        id: string;
        adminRoleId: string | null;
    }>;
    assignPermissionsToRole(dto: AssignPermissionsToRoleDto): Promise<{
        ok: boolean;
    }>;
    listPayments(query: PaginationDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            order: {
                status: import("@prisma/client").$Enums.OrderStatus;
                total: number;
                id: string;
            };
        } & {
            status: import("@prisma/client").$Enums.PaymentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            provider: string;
            stripeIntentId: string | null;
            amount: number;
            currency: string;
        })[];
    }>;
}
