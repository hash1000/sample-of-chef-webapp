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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createForUser(userId, dto) {
        const menuItemIds = dto.items.map((item) => item.menuItemId);
        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: menuItemIds }, isAvailable: true, restaurant: { isActive: true } },
            include: { restaurant: true },
        });
        const menuById = new Map(menuItems.map((item) => [item.id, item]));
        if (menuItems.length !== new Set(menuItemIds).size) {
            throw new common_1.BadRequestException('One or more menu items are unavailable');
        }
        const restaurantId = dto.restaurantId ?? menuItems[0]?.restaurantId;
        if (!restaurantId || menuItems.some((item) => item.restaurantId !== restaurantId)) {
            throw new common_1.BadRequestException('All items must belong to the same restaurant');
        }
        const subtotal = dto.items.reduce((sum, it) => {
            const menuItem = menuById.get(it.menuItemId);
            if (!menuItem)
                throw new common_1.BadRequestException('Invalid menu item');
            return sum + menuItem.priceCents * it.quantity;
        }, 0);
        const deliveryFee = subtotal >= 5000 ? 0 : 499;
        const total = subtotal + deliveryFee;
        return this.prisma.order.create({
            data: {
                userId,
                restaurantId,
                status: client_1.OrderStatus.pending,
                deliveryAddress: dto.deliveryAddress.trim(),
                paymentMethod: dto.paymentMethod ?? 'mock',
                subtotal,
                deliveryFee,
                total,
                items: {
                    create: dto.items.map((it) => {
                        const menuItem = menuById.get(it.menuItemId);
                        return {
                            name: menuItem.name,
                            quantity: it.quantity,
                            unitPrice: menuItem.priceCents,
                            lineTotal: menuItem.priceCents * it.quantity,
                        };
                    }),
                },
                payment: {
                    create: {
                        provider: dto.paymentMethod === 'stripe' ? 'stripe' : 'mock',
                        status: client_1.PaymentStatus.succeeded,
                        amount: total,
                        currency: 'usd',
                    },
                },
            },
            include: { items: true, payment: true, restaurant: true },
        });
    }
    async listForUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { items: true, restaurant: true, payment: true },
        });
    }
    async getForUser(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, restaurant: true, payment: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== userId)
            throw new common_1.ForbiddenException('Forbidden');
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map