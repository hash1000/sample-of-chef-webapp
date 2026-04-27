import { PrismaService } from '../prisma/prisma.service';
import { RestaurantsQueryDto } from './dto/restaurants-query.dto';
export declare class RestaurantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
                description: string | null;
                restaurantId: string;
                priceCents: number;
                category: string;
                isAvailable: boolean;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            city: import("@prisma/client").$Enums.City;
            status: import("@prisma/client").$Enums.RestaurantStatus;
            description: string | null;
            menuType: string | null;
            isActive: boolean;
            chefId: string | null;
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
            description: string | null;
            restaurantId: string;
            priceCents: number;
            category: string;
            isAvailable: boolean;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        city: import("@prisma/client").$Enums.City;
        status: import("@prisma/client").$Enums.RestaurantStatus;
        description: string | null;
        menuType: string | null;
        isActive: boolean;
        chefId: string | null;
    }>;
}
