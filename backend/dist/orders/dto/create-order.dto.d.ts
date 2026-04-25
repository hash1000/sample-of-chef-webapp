declare class CreateOrderItemDto {
    name: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreateOrderDto {
    items: CreateOrderItemDto[];
    deliveryFee: number;
}
export {};
