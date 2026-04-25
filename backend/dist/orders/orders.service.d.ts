import { Order } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createForUser(userId: string, dto: CreateOrderDto): Promise<Order>;
    listForUser(userId: string): Promise<({
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
    })[]>;
    getForUser(userId: string, orderId: string): Promise<{
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
}
