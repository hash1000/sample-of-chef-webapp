declare class CreateOrderItemDto {
    menuItemId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    restaurantId?: string;
    deliveryAddress: string;
    paymentMethod?: 'mock' | 'stripe';
    items: CreateOrderItemDto[];
}
export {};
