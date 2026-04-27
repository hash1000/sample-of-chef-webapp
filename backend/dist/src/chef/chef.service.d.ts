import { MenuItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChefOrdersQueryDto } from './dto/chef-orders-query.dto';
import { CreateMenuItemDto, ToggleAvailabilityDto, UpdateMenuItemDto } from './dto/menu.dto';
import { UpdateChefRestaurantDto } from './dto/restaurant.dto';
import { UpdateChefOrderStatusDto } from './dto/update-order-status.dto';
export declare class ChefService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getChefRestaurantOrThrow;
    getRestaurant(chefId: string): Promise<{
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
    updateRestaurant(chefId: string, dto: UpdateChefRestaurantDto): Promise<{
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
    listOrders(chefId: string, query: ChefOrdersQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            user: {
                id: string;
                email: string;
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
    getOrder(chefId: string, orderId: string): Promise<{
        user: {
            id: string;
            email: string;
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
    updateOrderStatus(chefId: string, orderId: string, dto: UpdateChefOrderStatusDto): Promise<({
        user: {
            id: string;
            email: string;
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
    }) | null>;
    listMenu(chefId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        restaurantId: string;
        priceCents: number;
        category: string;
        isAvailable: boolean;
    }[]>;
    createMenuItem(chefId: string, dto: CreateMenuItemDto): Promise<MenuItem>;
    updateMenuItem(chefId: string, id: string, dto: UpdateMenuItemDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        restaurantId: string;
        priceCents: number;
        category: string;
        isAvailable: boolean;
    }>;
    deleteMenuItem(chefId: string, id: string): Promise<{
        ok: boolean;
    }>;
    toggleAvailability(chefId: string, id: string, dto: ToggleAvailabilityDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        restaurantId: string;
        priceCents: number;
        category: string;
        isAvailable: boolean;
    }>;
}
