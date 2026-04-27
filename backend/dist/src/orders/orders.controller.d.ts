import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    create(dto: CreateOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        restaurantId: string | null;
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string;
    } | {
        payment: any;
        checkoutUrl: string;
        checkoutSessionId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        restaurantId: string | null;
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string;
    }>;
    confirmPayment(id: string, dto: {
        sessionId: string;
    }): Promise<{
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            isActive: boolean;
            chefId: string | null;
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
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string;
    }>;
    listMine(req: any): Promise<({
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            isActive: boolean;
            chefId: string | null;
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
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string;
    })[]>;
    get(id: string): Promise<{
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            isActive: boolean;
            chefId: string | null;
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
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string;
    }>;
}
