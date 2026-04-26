import { RestaurantsQueryDto } from './dto/restaurants-query.dto';
import { RestaurantsService } from './restaurants.service';
export declare class RestaurantsController {
    private readonly restaurants;
    constructor(restaurants: RestaurantsService);
    list(query: RestaurantsQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: ({
            menuItems: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                restaurantId: string;
                priceCents: number;
                category: string;
                isAvailable: boolean;
            }[];
        } & {
            name: string;
            chefId: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
        })[];
    }>;
    get(id: string): Promise<{
        chef: {
            name: string;
            id: string;
        } | null;
        menuItems: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            priceCents: number;
            category: string;
            isAvailable: boolean;
        }[];
    } & {
        name: string;
        chefId: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
    }>;
}
