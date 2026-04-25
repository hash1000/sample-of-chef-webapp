import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: number;
        userId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        subtotal: number;
        total: number;
    }>;
    listMine(req: any): Promise<({
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
    getMine(req: any, id: string): Promise<{
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
