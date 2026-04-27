import { City, RestaurantStatus } from '@prisma/client';
export declare class CreateRestaurantDto {
    name: string;
    city: City;
    chefId?: string;
    description?: string;
    menuType?: string;
    rating?: number;
    status?: RestaurantStatus;
}
export declare class UpdateRestaurantDto {
    name?: string;
    isActive?: boolean;
    city?: City;
    description?: string | null;
    menuType?: string | null;
    rating?: number;
    status?: RestaurantStatus;
    chefId?: string | null;
}
