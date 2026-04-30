import { AdminService } from './admin.service';
import { AdminOrdersFilterDto } from './dto/orders-filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurants.dto';
import { AssignPermissionsToRoleDto, AssignRoleToUserDto, CreateAdminRoleDto, CreatePermissionDto } from './dto/roles-permissions.dto';
export declare class AdminController {
    private readonly admin;
    constructor(admin: AdminService);
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
            email: string;
            name: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            isBlocked: boolean;
            createdAt: Date;
        }[];
    }>;
    blockUser(id: string): Promise<{
        id: string;
        isBlocked: boolean;
    }>;
    unblockUser(id: string): Promise<{
        id: string;
        isBlocked: boolean;
    }>;
    deleteUser(id: string): Promise<{
        ok: boolean;
    }>;
    createRestaurant(dto: CreateRestaurantDto): Promise<{
        status: import("@prisma/client").$Enums.RestaurantStatus;
        isActive: boolean;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        menuType: string | null;
        bannerImageUrl: string | null;
        chefId: string | null;
    }>;
    listRestaurants(query: PaginationDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            chef: {
                email: string;
                name: string;
                id: string;
            } | null;
        } & {
            status: import("@prisma/client").$Enums.RestaurantStatus;
            isActive: boolean;
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            menuType: string | null;
            bannerImageUrl: string | null;
            chefId: string | null;
        })[];
    }>;
    updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<{
        chef: {
            email: string;
            name: string;
            id: string;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.RestaurantStatus;
        isActive: boolean;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        menuType: string | null;
        bannerImageUrl: string | null;
        chefId: string | null;
    }>;
    approveRestaurant(id: string): Promise<{
        chef: {
            email: string;
            name: string;
            id: string;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.RestaurantStatus;
        isActive: boolean;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        menuType: string | null;
        bannerImageUrl: string | null;
        chefId: string | null;
    }>;
    rejectRestaurant(id: string): Promise<{
        chef: {
            email: string;
            name: string;
            id: string;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.RestaurantStatus;
        isActive: boolean;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        menuType: string | null;
        bannerImageUrl: string | null;
        chefId: string | null;
    }>;
    blockRestaurant(id: string): Promise<{
        chef: {
            email: string;
            name: string;
            id: string;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.RestaurantStatus;
        isActive: boolean;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        menuType: string | null;
        bannerImageUrl: string | null;
        chefId: string | null;
    }>;
    unblockRestaurant(id: string): Promise<{
        chef: {
            email: string;
            name: string;
            id: string;
        } | null;
    } & {
        status: import("@prisma/client").$Enums.RestaurantStatus;
        isActive: boolean;
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        menuType: string | null;
        bannerImageUrl: string | null;
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
                email: string;
                name: string;
                id: string;
            } | null;
            items: {
                name: string;
                id: string;
                orderId: string;
                quantity: number;
                unitPrice: number;
                lineTotal: number;
            }[];
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
        } & {
            status: import("@prisma/client").$Enums.OrderStatus;
            total: number;
            subtotal: number;
            deliveryFee: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            restaurantId: string | null;
            customerName: string;
            customerEmail: string;
            customerPhone: string;
            deliveryAddress: string | null;
            paymentMethod: string;
        })[];
    }>;
    getOrder(id: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        items: {
            name: string;
            id: string;
            orderId: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
        }[];
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
    } & {
        status: import("@prisma/client").$Enums.OrderStatus;
        total: number;
        subtotal: number;
        deliveryFee: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        restaurantId: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        deliveryAddress: string | null;
        paymentMethod: string;
    }>;
    createRole(dto: CreateAdminRoleDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listRoles(): Promise<({
        permissions: ({
            permission: {
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                key: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createPermission(dto: CreatePermissionDto): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
    }>;
    assignRole(dto: AssignRoleToUserDto): Promise<{
        id: string;
        adminRoleId: string | null;
    }>;
    assignRolePermissions(dto: AssignPermissionsToRoleDto): Promise<{
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
