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
exports.ChefService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function pageParams(q) {
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
let ChefService = class ChefService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getChefRestaurantOrThrow(chefId, requireApproved = true) {
        const restaurant = await this.prisma.restaurant.findFirst({
            where: { chefId },
            orderBy: { createdAt: 'desc' },
        });
        if (!restaurant)
            throw new common_1.ForbiddenException('Chef has no assigned restaurant');
        if (requireApproved &&
            (restaurant.status !== client_1.RestaurantStatus.approved || !restaurant.isActive)) {
            throw new common_1.ForbiddenException(`Restaurant is ${restaurant.status} and cannot access this feature`);
        }
        return restaurant;
    }
    async getRestaurant(chefId) {
        return this.getChefRestaurantOrThrow(chefId, false);
    }
    async updateRestaurant(chefId, dto) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId, false);
        if (restaurant.status === client_1.RestaurantStatus.blocked) {
            throw new common_1.ForbiddenException('Blocked restaurant cannot be updated');
        }
        return this.prisma.restaurant.update({
            where: { id: restaurant.id },
            data: {
                name: dto.name?.trim(),
                city: dto.city,
                menuType: dto.menuType?.trim(),
                description: dto.description?.trim(),
            },
        });
    }
    async listOrders(chefId, query) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId);
        const { page, limit, skip } = pageParams(query);
        const statusWhere = query.status === 'completed'
            ? { in: [client_1.OrderStatus.delivered] }
            : query.status === 'dispatched'
                ? { in: [client_1.OrderStatus.ready] }
                : query.status
                    ? { equals: query.status }
                    : undefined;
        const where = {
            restaurantId: restaurant.id,
            ...(statusWhere ? { status: statusWhere } : {}),
        };
        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    items: true,
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        return { page, limit, total, items };
    }
    async getOrder(chefId, orderId) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId);
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { user: { select: { id: true, name: true, email: true } }, items: true, payment: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.restaurantId !== restaurant.id)
            throw new common_1.ForbiddenException('Forbidden');
        return order;
    }
    async updateOrderStatus(chefId, orderId, dto) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId);
        const desired = dto.status;
        const transition = desired === 'accepted'
            ? { from: client_1.OrderStatus.pending, to: client_1.OrderStatus.accepted }
            : desired === 'preparing'
                ? { from: client_1.OrderStatus.accepted, to: client_1.OrderStatus.preparing }
                : desired === 'completed'
                    ? { from: client_1.OrderStatus.ready, to: client_1.OrderStatus.delivered }
                    : { from: client_1.OrderStatus.preparing, to: client_1.OrderStatus.ready };
        const updated = await this.prisma.order.updateMany({
            where: {
                id: orderId,
                restaurantId: restaurant.id,
                status: transition.from,
            },
            data: { status: transition.to },
        });
        if (updated.count !== 1) {
            const order = await this.prisma.order.findUnique({ where: { id: orderId } });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (order.restaurantId !== restaurant.id)
                throw new common_1.ForbiddenException('Forbidden');
            throw new common_1.BadRequestException(`Invalid status transition: ${order.status} -> ${transition.to}`);
        }
        return this.prisma.order.findUnique({
            where: { id: orderId },
            include: { user: { select: { id: true, name: true, email: true } }, items: true, payment: true },
        });
    }
    async listMenu(chefId) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId);
        return this.prisma.menuItem.findMany({
            where: { restaurantId: restaurant.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createMenuItem(chefId, dto) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId);
        return this.prisma.menuItem.create({
            data: {
                restaurantId: restaurant.id,
                name: dto.name.trim(),
                priceCents: dto.priceCents,
                category: dto.category.trim(),
                description: dto.description?.trim(),
            },
        });
    }
    async updateMenuItem(chefId, id, dto) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId);
        const item = await this.prisma.menuItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Menu item not found');
        if (item.restaurantId !== restaurant.id)
            throw new common_1.ForbiddenException('Forbidden');
        return this.prisma.menuItem.update({
            where: { id },
            data: {
                name: dto.name?.trim(),
                priceCents: dto.priceCents,
                category: dto.category?.trim(),
                description: dto.description?.trim(),
                isAvailable: dto.isAvailable,
            },
        });
    }
    async deleteMenuItem(chefId, id) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId);
        const item = await this.prisma.menuItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Menu item not found');
        if (item.restaurantId !== restaurant.id)
            throw new common_1.ForbiddenException('Forbidden');
        await this.prisma.menuItem.delete({ where: { id } });
        return { ok: true };
    }
    async toggleAvailability(chefId, id, dto) {
        const restaurant = await this.getChefRestaurantOrThrow(chefId);
        const item = await this.prisma.menuItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Menu item not found');
        if (item.restaurantId !== restaurant.id)
            throw new common_1.ForbiddenException('Forbidden');
        return this.prisma.menuItem.update({
            where: { id },
            data: { isAvailable: dto.isAvailable },
        });
    }
};
exports.ChefService = ChefService;
exports.ChefService = ChefService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChefService);
//# sourceMappingURL=chef.service.js.map