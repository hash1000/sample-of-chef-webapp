export declare class CreateRestaurantDto {
    name: string;
    chefId?: string;
}
export declare class UpdateRestaurantDto {
    name?: string;
    isActive?: boolean;
    chefId?: string | null;
}
