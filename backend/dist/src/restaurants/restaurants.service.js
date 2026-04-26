"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function pageParams(query) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    return { page, limit, skip: (page - 1) * limit };
}
let RestaurantsService = class RestaurantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const { page, limit, skip } = pageParams(query);
        const q = query.q?.trim();
        const category = query.category?.trim();
        const where = {
            isActive: true,
            ...(q
                ? {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        {
                            menuItems: {
                                some: { name: { contains: q, mode: 'insensitive' } },
                            },
                        },
                    ],
                }
                : {}),
            ...(category
                ? {
                    menuItems: {
                        some: { category: { contains: category, mode: 'insensitive' } },
                    },
                }
                : {}),
        };
        const [items, total] = await Promise.all([
            this.prisma.restaurant.findMany({
                where,
                orderBy: [{ rating: 'desc' }, { name: 'asc' }],
                skip,
                take: limit,
                include: {
                    menuItems: {
                        where: { isAvailable: true },
                        orderBy: { createdAt: 'desc' },
                        take: 4,
                    },
                },
            }),
            this.prisma.restaurant.count({ where }),
        ]);
        return { page, limit, total, items };
    }
    async get(id) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: { id, isActive: true },
            include: {
                chef: { select: { id: true, name: true } },
                menuItems: { orderBy: [{ category: 'asc' }, { name: 'asc' }] },
            },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        return restaurant;
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map