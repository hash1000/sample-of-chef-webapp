import { ChefOrdersQueryDto } from './dto/chef-orders-query.dto';
import { CreateMenuItemDto, ToggleAvailabilityDto, UpdateMenuItemDto } from './dto/menu.dto';
import { UpdateChefOrderStatusDto } from './dto/update-order-status.dto';
import { ChefService } from './chef.service';
export declare class ChefController {
    private readonly chef;
    constructor(chef: ChefService);
    listOrders(req: any, query: ChefOrdersQueryDto): Promise<{
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
    getOrder(req: any, id: string): Promise<{
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
    updateStatus(req: any, id: string, dto: UpdateChefOrderStatusDto): Promise<({
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
    listMenu(req: any): Promise<{
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
    createMenu(req: any, dto: CreateMenuItemDto): Promise<{
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
    updateMenu(req: any, id: string, dto: UpdateMenuItemDto): Promise<{
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
    deleteMenu(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    toggleAvailability(req: any, id: string, dto: ToggleAvailabilityDto): Promise<{
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
