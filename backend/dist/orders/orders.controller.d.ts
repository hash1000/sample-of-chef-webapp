import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<{
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string;
        total: number;
        subtotal: number;
        deliveryFee: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string | null;
        deliveryAddress: string | null;
        paymentMethod: string;
    }>;
    listMine(req: any): Promise<({
        restaurant: {
            name: string;
            chefId: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
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
        deliveryAddress: string | null;
        paymentMethod: string;
    })[]>;
    getMine(req: any, id: string): Promise<{
        restaurant: {
            name: string;
            chefId: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
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
        deliveryAddress: string | null;
        paymentMethod: string;
    }>;
}
