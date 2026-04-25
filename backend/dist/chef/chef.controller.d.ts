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
    getOrder(req: any, id: string): Promise<{
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
    updateStatus(req: any, id: string, dto: UpdateChefOrderStatusDto): Promise<{
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
    listMenu(req: any): Promise<{
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
    createMenu(req: any, dto: CreateMenuItemDto): Promise<{
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
    updateMenu(req: any, id: string, dto: UpdateMenuItemDto): Promise<{
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
    deleteMenu(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    toggleAvailability(req: any, id: string, dto: ToggleAvailabilityDto): Promise<{
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
