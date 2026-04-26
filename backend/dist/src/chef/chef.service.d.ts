import { MenuItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChefOrdersQueryDto } from './dto/chef-orders-query.dto';
import { CreateMenuItemDto, ToggleAvailabilityDto, UpdateMenuItemDto } from './dto/menu.dto';
import { UpdateChefOrderStatusDto } from './dto/update-order-status.dto';
export declare class ChefService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getChefRestaurantOrThrow;
    listOrders(chefId: string, query: ChefOrdersQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
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
    getOrder(chefId: string, orderId: string): Promise<{
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
    updateOrderStatus(chefId: string, orderId: string, dto: UpdateChefOrderStatusDto): Promise<({
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
    }) | null>;
    listMenu(chefId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        priceCents: number;
        category: string;
        description: string | null;
        isAvailable: boolean;
    }[]>;
    createMenuItem(chefId: string, dto: CreateMenuItemDto): Promise<MenuItem>;
    updateMenuItem(chefId: string, id: string, dto: UpdateMenuItemDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        priceCents: number;
        category: string;
        description: string | null;
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
        restaurantId: string;
        priceCents: number;
        category: string;
        description: string | null;
        isAvailable: boolean;
    }>;
}
