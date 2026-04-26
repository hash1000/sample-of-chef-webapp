export declare class CreateMenuItemDto {
    name: string;
    priceCents: number;
    category: string;
    description?: string;
}
export declare class UpdateMenuItemDto {
    name?: string;
    priceCents?: number;
    category?: string;
    description?: string;
    isAvailable?: boolean;
}
export declare class ToggleAvailabilityDto {
    isAvailable: boolean;
}
