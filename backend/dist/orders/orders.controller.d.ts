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
    }>;
    listMine(req: any): Promise<({
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
    getMine(req: any, id: string): Promise<{
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
