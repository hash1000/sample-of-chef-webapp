import { ConfigService } from '@nestjs/config';
import { Order } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    createForUser(userId: string, dto: CreateOrderDto): Promise<Order>;
    createGuest(dto: CreateOrderDto): Promise<({
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            status: import("@prisma/client").$Enums.RestaurantStatus;
            description: string | null;
            menuType: string | null;
            bannerImageUrl: string | null;
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
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        deliveryAddress: string | null;
        paymentMethod: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string | null;
    }) | {
        payment: {
            stripeIntentId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            provider: string;
            amount: number;
            currency: string;
            orderId: string;
        } | null;
        checkoutUrl: string;
        checkoutSessionId: string;
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            status: import("@prisma/client").$Enums.RestaurantStatus;
            description: string | null;
            menuType: string | null;
            bannerImageUrl: string | null;
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
    private createOrder;
    listForUser(userId: string): Promise<({
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            status: import("@prisma/client").$Enums.RestaurantStatus;
            description: string | null;
            menuType: string | null;
            bannerImageUrl: string | null;
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
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        deliveryAddress: string | null;
        paymentMethod: string;
        subtotal: number;
        deliveryFee: number;
        total: number;
        userId: string | null;
    })[]>;
    getForUser(userId: string, orderId: string): Promise<{
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            status: import("@prisma/client").$Enums.RestaurantStatus;
            description: string | null;
            menuType: string | null;
            bannerImageUrl: string | null;
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
    getPublic(orderId: string): Promise<{
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            status: import("@prisma/client").$Enums.RestaurantStatus;
            description: string | null;
            menuType: string | null;
            bannerImageUrl: string | null;
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
    confirmStripePayment(orderId: string, sessionId: string): Promise<{
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            status: import("@prisma/client").$Enums.RestaurantStatus;
            description: string | null;
            menuType: string | null;
            bannerImageUrl: string | null;
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
    private stripeSecretKey;
    private frontendUrl;
    private createStripeCheckoutSession;
    private retrieveStripeCheckoutSession;
}
