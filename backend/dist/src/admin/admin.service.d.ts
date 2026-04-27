import { RestaurantStatus } from '@prisma/client';
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
        activeApprovedRestaurants: number;
        pendingRestaurants: number;
        totalOrders: number;
        totalRevenue: number;
    }>;
    listUsers(query: PaginationDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: {
            id: string;
            email: string;
            name: string;
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
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        status: import("@prisma/client").$Enums.RestaurantStatus;
        description: string | null;
        menuType: string | null;
        isActive: boolean;
        chefId: string | null;
    }>;
    listRestaurants(query: PaginationDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            chef: {
                id: string;
                email: string;
                name: string;
            } | null;
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            status: import("@prisma/client").$Enums.RestaurantStatus;
            description: string | null;
            menuType: string | null;
            isActive: boolean;
            chefId: string | null;
        })[];
    }>;
    updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<{
        chef: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        status: import("@prisma/client").$Enums.RestaurantStatus;
        description: string | null;
        menuType: string | null;
        isActive: boolean;
        chefId: string | null;
    }>;
    setRestaurantStatus(id: string, status: RestaurantStatus): Promise<{
        chef: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        status: import("@prisma/client").$Enums.RestaurantStatus;
        description: string | null;
        menuType: string | null;
        isActive: boolean;
        chefId: string | null;
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
                id: string;
                email: string;
                name: string;
            } | null;
            restaurant: {
                id: string;
                name: string;
            } | null;
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
            status: import("@prisma/client").$Enums.OrderStatus;
            restaurantId: string | null;
            customerName: string;
            customerEmail: string;
            customerPhone: string;
            deliveryAddress: string | null;
            paymentMethod: string;
            subtotal: number;
            deliveryFee: number;
            total: number;
            userId: string | null;
        })[];
    }>;
    getOrder(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        } | null;
        restaurant: {
            id: string;
            name: string;
        } | null;
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
        status: import("@prisma/client").$Enums.OrderStatus;
        restaurantId: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        deliveryAddress: string | null;
        paymentMethod: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string | null;
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
