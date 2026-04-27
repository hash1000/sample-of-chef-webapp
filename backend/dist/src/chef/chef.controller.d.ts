import { ChefOrdersQueryDto } from './dto/chef-orders-query.dto';
import { CreateMenuItemDto, ToggleAvailabilityDto, UpdateMenuItemDto } from './dto/menu.dto';
import { UpdateChefRestaurantDto } from './dto/restaurant.dto';
import { UpdateChefOrderStatusDto } from './dto/update-order-status.dto';
import { ChefService } from './chef.service';
export declare class ChefController {
    private readonly chef;
    constructor(chef: ChefService);
    getRestaurant(req: any): Promise<{
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
    updateRestaurant(req: any, dto: UpdateChefRestaurantDto): Promise<{
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
    listOrders(req: any, query: ChefOrdersQueryDto): Promise<{
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
    getOrder(req: any, id: string): Promise<{
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
    updateStatus(req: any, id: string, dto: UpdateChefOrderStatusDto): Promise<({
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
    listMenu(req: any): Promise<{
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
    createMenu(req: any, dto: CreateMenuItemDto): Promise<{
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
    updateMenu(req: any, id: string, dto: UpdateMenuItemDto): Promise<{
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
    deleteMenu(req: any, id: string): Promise<{
        ok: boolean;
    }>;
    toggleAvailability(req: any, id: string, dto: ToggleAvailabilityDto): Promise<{
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
