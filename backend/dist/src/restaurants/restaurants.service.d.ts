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
