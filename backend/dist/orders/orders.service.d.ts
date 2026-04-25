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
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: number;
        userId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: number;
        total: number;
    })[]>;
    getForUser(userId: string, orderId: string): Promise<{
        items: {
            name: string;
            id: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: number;
        userId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: number;
        total: number;
    }>;
}
