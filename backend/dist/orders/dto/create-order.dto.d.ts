declare class CreateOrderItemDto {
    name: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateOrderDto {
    restaurantId?: string;
    items: CreateOrderItemDto[];
    deliveryFee: number;
}
export {};
