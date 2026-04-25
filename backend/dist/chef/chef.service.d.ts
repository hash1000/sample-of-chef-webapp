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
                name: string;
                email: string;
                id: string;
            };
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
    getOrder(chefId: string, orderId: string): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
        };
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
    updateOrderStatus(chefId: string, orderId: string, dto: UpdateChefOrderStatusDto): Promise<{
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
    listMenu(chefId: string): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        priceCents: number;
        category: string;
        isAvailable: boolean;
    }[]>;
    createMenuItem(chefId: string, dto: CreateMenuItemDto): Promise<MenuItem>;
    updateMenuItem(chefId: string, id: string, dto: UpdateMenuItemDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        priceCents: number;
        category: string;
        isAvailable: boolean;
    }>;
    deleteMenuItem(chefId: string, id: string): Promise<{
        ok: boolean;
    }>;
    toggleAvailability(chefId: string, id: string, dto: ToggleAvailabilityDto): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        priceCents: number;
        category: string;
        isAvailable: boolean;
    }>;
}
