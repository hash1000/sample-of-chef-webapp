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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function paginate(q) {
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.min(100, Math.max(1, q.limit ?? 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async dashboard() {
        const [totalUsers, totalRestaurants, activeApprovedRestaurants, pendingRestaurants, totalOrders, revenueAgg,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.restaurant.count(),
            this.prisma.restaurant.count({
                where: { status: client_1.RestaurantStatus.approved, isActive: true },
            }),
            this.prisma.restaurant.count({ where: { status: client_1.RestaurantStatus.pending } }),
            this.prisma.order.count(),
            this.prisma.order.aggregate({ _sum: { total: true } }),
        ]);
        return {
            totalUsers,
            totalRestaurants,
            activeApprovedRestaurants,
            pendingRestaurants,
            totalOrders,
            totalRevenue: revenueAgg._sum.total ?? 0,
        };
    }
    async listUsers(query) {
        const { limit, skip, page } = paginate(query);
        const q = query.q?.trim();
        const where = q
            ? {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                ],
            }
            : {};
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isBlocked: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return { page, limit, total, items };
    }
    async blockUser(userId, blocked = true) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id: userId },
            data: { isBlocked: blocked },
            select: { id: true, isBlocked: true },
        });
    }
    async deleteUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.prisma.user.delete({ where: { id: userId } });
        return { ok: true };
    }
    async createRestaurant(dto) {
        if (dto.chefId) {
            const chef = await this.prisma.user.findUnique({ where: { id: dto.chefId } });
            if (!chef)
                throw new common_1.BadRequestException('chefId not found');
            if (chef.role !== client_1.Role.chef)
                throw new common_1.BadRequestException('chefId must be a chef');
        }
        return this.prisma.restaurant.create({
            data: {
                name: dto.name.trim(),
                city: dto.city,
                status: dto.status ?? client_1.RestaurantStatus.approved,
                description: dto.description?.trim(),
                menuType: dto.menuType?.trim(),
                rating: dto.rating ?? 0,
                isActive: dto.status === client_1.RestaurantStatus.blocked ? false : true,
                chefId: dto.chefId ?? null,
            },
        });
    }
    async listRestaurants(query) {
        const { limit, skip, page } = paginate(query);
        const q = query.q?.trim();
        const where = q ? { name: { contains: q, mode: 'insensitive' } } : {};
        const [items, total] = await Promise.all([
            this.prisma.restaurant.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: { chef: { select: { id: true, email: true, name: true } } },
            }),
            this.prisma.restaurant.count({ where }),
        ]);
        return { page, limit, total, items };
    }
    async updateRestaurant(id, dto) {
        const existing = await this.prisma.restaurant.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Restaurant not found');
        if (dto.chefId !== undefined) {
            if (dto.chefId === null || dto.chefId === '') {
            }
            else {
                const chef = await this.prisma.user.findUnique({ where: { id: dto.chefId } });
                if (!chef)
                    throw new common_1.BadRequestException('chefId not found');
                if (chef.role !== client_1.Role.chef)
                    throw new common_1.BadRequestException('chefId must be a chef');
            }
        }
        return this.prisma.restaurant.update({
            where: { id },
            data: {
                name: dto.name?.trim(),
                city: dto.city,
                status: dto.status,
                description: dto.description === null ? null : dto.description?.trim(),
                menuType: dto.menuType === null ? null : dto.menuType?.trim(),
                rating: dto.rating,
                isActive: dto.isActive,
                chefId: dto.chefId === '' ? null : dto.chefId,
            },
            include: { chef: { select: { id: true, email: true, name: true } } },
        });
    }
    async setRestaurantStatus(id, status) {
        const existing = await this.prisma.restaurant.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Restaurant not found');
        const isActive = status === client_1.RestaurantStatus.approved
            ? true
            : status === client_1.RestaurantStatus.blocked || status === client_1.RestaurantStatus.rejected
                ? false
                : existing.isActive;
        return this.prisma.restaurant.update({
            where: { id },
            data: { status, isActive },
            include: { chef: { select: { id: true, email: true, name: true } } },
        });
    }
    async deleteRestaurant(id) {
        const existing = await this.prisma.restaurant.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Restaurant not found');
        await this.prisma.restaurant.delete({ where: { id } });
        return { ok: true };
    }
    async listOrders(query, filter) {
        const { limit, skip, page } = paginate(query);
        const q = query.q?.trim();
        const createdAt = {};
        if (filter.from)
            createdAt.gte = new Date(filter.from);
        if (filter.to)
            createdAt.lte = new Date(filter.to);
        const where = {
            ...(filter.status ? { status: filter.status } : {}),
            ...(filter.from || filter.to ? { createdAt } : {}),
            ...(q
                ? {
                    OR: [
                        { id: { contains: q, mode: 'insensitive' } },
                        { user: { email: { contains: q, mode: 'insensitive' } } },
                        { user: { name: { contains: q, mode: 'insensitive' } } },
                        { restaurant: { name: { contains: q, mode: 'insensitive' } } },
                    ],
                }
                : {}),
        };
        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, email: true, name: true } },
                    restaurant: { select: { id: true, name: true } },
                    payment: true,
                    items: true,
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        return { page, limit, total, items };
    }
    async getOrder(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                restaurant: { select: { id: true, name: true } },
                payment: true,
                items: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async createAdminRole(dto) {
        return this.prisma.adminRole.create({ data: { name: dto.name.trim() } });
    }
    async listAdminRoles() {
        return this.prisma.adminRole.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                permissions: { include: { permission: true } },
            },
        });
    }
    async createPermission(dto) {
        return this.prisma.permission.create({
            data: { key: dto.key.trim(), description: dto.description?.trim() },
        });
    }
    async assignRoleToUser(dto) {
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const role = await this.prisma.adminRole.findUnique({ where: { id: dto.roleId } });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        return this.prisma.user.update({
            where: { id: dto.userId },
            data: { adminRoleId: dto.roleId },
            select: { id: true, adminRoleId: true },
        });
    }
    async assignPermissionsToRole(dto) {
        const role = await this.prisma.adminRole.findUnique({ where: { id: dto.roleId } });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        const existing = await this.prisma.permission.findMany({
            where: { id: { in: dto.permissionIds } },
            select: { id: true },
        });
        const okIds = new Set(existing.map((p) => p.id));
        const missing = dto.permissionIds.filter((id) => !okIds.has(id));
        if (missing.length)
            throw new common_1.BadRequestException(`Unknown permissionIds: ${missing.join(', ')}`);
        await this.prisma.$transaction([
            this.prisma.rolePermission.deleteMany({ where: { roleId: dto.roleId } }),
            this.prisma.rolePermission.createMany({
                data: dto.permissionIds.map((permissionId) => ({
                    roleId: dto.roleId,
                    permissionId,
                })),
            }),
        ]);
        return { ok: true };
    }
    async listPayments(query) {
        const { limit, skip, page } = paginate(query);
        const q = query.q?.trim();
        const where = q
            ? {
                OR: [
                    { id: { contains: q, mode: 'insensitive' } },
                    { stripeIntentId: { contains: q, mode: 'insensitive' } },
                    { orderId: { contains: q, mode: 'insensitive' } },
                ],
            }
            : {};
        const [items, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: { order: { select: { id: true, total: true, status: true } } },
            }),
            this.prisma.payment.count({ where }),
        ]);
        return { page, limit, total, items };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map