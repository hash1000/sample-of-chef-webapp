import { OrderStatus } from '@prisma/client';
export declare class AdminOrdersFilterDto {
    status?: OrderStatus;
    from?: string;
    to?: string;
}
