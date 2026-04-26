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
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
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
        id: string;
        name: string;
        rating: number;
        isActive: boolean;
        chefId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listRestaurants(query: PaginationDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            chef: {
                id: string;
                name: string;
                email: string;
            } | null;
        } & {
            id: string;
            name: string;
            rating: number;
            isActive: boolean;
            chefId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<{
        chef: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        id: string;
        name: string;
        rating: number;
        isActive: boolean;
        chefId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteRestaurant(id: string): Promise<{
        ok: boolean;
    }>;
    listOrders(query: PaginationDto, filter: AdminOrdersFilterDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            restaurant: {
                id: string;
                name: string;
            } | null;
            user: {
                id: string;
                name: string;
                email: string;
            };
            items: {
                id: string;
                name: string;
                quantity: number;
                unitPrice: number;
                lineTotal: number;
                orderId: string;
            }[];
            payment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                provider: string;
                stripeIntentId: string | null;
                amount: number;
                currency: string;
                orderId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string | null;
            status: import("@prisma/client").$Enums.OrderStatus;
            deliveryAddress: string | null;
            paymentMethod: string;
            subtotal: number;
            deliveryFee: number;
            total: number;
            userId: string;
        })[];
    }>;
    getOrder(id: string): Promise<{
        restaurant: {
            id: string;
            name: string;
        } | null;
        user: {
            id: string;
            name: string;
            email: string;
        };
        items: {
            id: string;
            name: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            orderId: string;
        }[];
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            provider: string;
            stripeIntentId: string | null;
            amount: number;
            currency: string;
            orderId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        deliveryAddress: string | null;
        paymentMethod: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string;
    }>;
    createAdminRole(dto: CreateAdminRoleDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listAdminRoles(): Promise<({
        permissions: ({
            permission: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                key: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createPermission(dto: CreatePermissionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
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
                id: string;
                status: import("@prisma/client").$Enums.OrderStatus;
                total: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            provider: string;
            stripeIntentId: string | null;
            amount: number;
            currency: string;
            orderId: string;
        })[];
    }>;
}
