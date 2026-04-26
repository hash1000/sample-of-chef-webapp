declare class CreateOrderItemDto {
    menuItemId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    restaurantId?: string;
    deliveryAddress: string;
    paymentMethod?: 'mock' | 'stripe';
    items: CreateOrderItemDto[];
}
export {};
