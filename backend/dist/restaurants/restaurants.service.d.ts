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
