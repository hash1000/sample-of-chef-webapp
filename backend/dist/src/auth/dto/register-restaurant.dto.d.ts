import { City } from '@prisma/client';
export declare class RegisterRestaurantDto {
    name: string;
    email: string;
    password: string;
    restaurantName: string;
    city: City;
    menuType: string;
    description?: string;
}
