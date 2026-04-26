import { Order } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createForUser(userId: string, dto: CreateOrderDto): Promise<Order>;
    listForUser(userId: string): Promise<({
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
    getForUser(userId: string, orderId: string): Promise<{
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
