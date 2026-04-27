import { City } from '@prisma/client';
export declare class UpdateChefRestaurantDto {
    name?: string;
    city?: City;
    menuType?: string;
    description?: string;
}
