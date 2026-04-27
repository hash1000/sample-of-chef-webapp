import { City } from '@prisma/client';
export declare class RestaurantsQueryDto {
    q?: string;
    category?: string;
    city?: City;
    page?: number;
    limit?: number;
}
