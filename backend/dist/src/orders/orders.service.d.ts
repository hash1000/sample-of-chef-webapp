import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    createForUser(userId: string, dto: CreateOrderDto): Promise<Order>;
    createGuest(dto: CreateOrderDto): Promise<{
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
    private createOrder;
    listForUser(userId: string): Promise<({
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
    getForUser(userId: string, orderId: string): Promise<{
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
    getPublic(orderId: string): Promise<{
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
    confirmStripePayment(orderId: string, sessionId: string): Promise<{
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
    private stripeSecretKey;
    private frontendUrl;
    private createStripeCheckoutSession;
    private retrieveStripeCheckoutSession;
}
