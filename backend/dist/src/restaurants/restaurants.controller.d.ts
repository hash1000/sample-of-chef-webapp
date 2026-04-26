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
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                restaurantId: string;
                priceCents: number;
                category: string;
                description: string | null;
                isAvailable: boolean;
            }[];
        } & {
            id: string;
            name: string;
            rating: number;
            isActive: boolean;
            chefId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    get(id: string): Promise<{
        chef: {
            id: string;
            name: string;
        } | null;
        menuItems: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            priceCents: number;
            category: string;
            description: string | null;
            isAvailable: boolean;
        }[];
    } & {
        id: string;
        name: string;
        rating: number;
        isActive: boolean;
        chefId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
