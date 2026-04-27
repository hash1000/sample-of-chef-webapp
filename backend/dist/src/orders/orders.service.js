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
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async createForUser(userId, dto) {
        return this.createOrder(dto, userId);
    }
    async createGuest(dto) {
        return this.createOrder(dto);
    }
    async createOrder(dto, userId) {
        const menuItemIds = dto.items.map((item) => item.menuItemId);
        const menuItems = await this.prisma.menuItem.findMany({
            where: {
                id: { in: menuItemIds },
                isAvailable: true,
                restaurant: { isActive: true, status: client_1.RestaurantStatus.approved },
            },
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
        const paymentMethod = dto.paymentMethod ?? 'stripe';
        const order = await this.prisma.order.create({
            data: {
                userId,
                restaurantId,
                status: client_1.OrderStatus.pending,
                customerName: dto.customerName.trim(),
                customerEmail: dto.customerEmail.toLowerCase().trim(),
                customerPhone: dto.customerPhone.trim(),
                deliveryAddress: dto.deliveryAddress.trim(),
                paymentMethod,
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
                        provider: paymentMethod === 'stripe' ? 'stripe' : 'mock',
                        status: paymentMethod === 'stripe' ? client_1.PaymentStatus.processing : client_1.PaymentStatus.succeeded,
                        amount: total,
                        currency: 'usd',
                    },
                },
            },
            include: { items: true, payment: true, restaurant: true },
        });
        if (paymentMethod !== 'stripe') {
            return order;
        }
        const checkout = await this.createStripeCheckoutSession(order);
        await this.prisma.payment.update({
            where: { orderId: order.id },
            data: { stripeIntentId: checkout.id },
        });
        return {
            ...order,
            payment: order.payment ? { ...order.payment, stripeIntentId: checkout.id } : order.payment,
            checkoutUrl: checkout.url,
            checkoutSessionId: checkout.id,
        };
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
    async getPublic(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, restaurant: true, payment: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async confirmStripePayment(orderId, sessionId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true, items: true, restaurant: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (!order.payment || order.payment.stripeIntentId !== sessionId) {
            throw new common_1.BadRequestException('Invalid payment session');
        }
        const session = await this.retrieveStripeCheckoutSession(sessionId);
        if (session.payment_status !== 'paid') {
            return order;
        }
        return this.prisma.order.update({
            where: { id: order.id },
            data: {
                payment: {
                    update: {
                        status: client_1.PaymentStatus.succeeded,
                    },
                },
            },
            include: { items: true, restaurant: true, payment: true },
        });
    }
    stripeSecretKey() {
        const key = this.config.get('STRIPE_SECRET_KEY')?.trim();
        if (!key)
            throw new common_1.BadRequestException('Stripe is not configured');
        return key;
    }
    frontendUrl() {
        return this.config.get('FRONTEND_URL')?.trim() || 'http://127.0.0.1:5173';
    }
    async createStripeCheckoutSession(order) {
        const params = new URLSearchParams();
        params.set('mode', 'payment');
        params.set('customer_email', order.customerEmail);
        params.set('success_url', `${this.frontendUrl()}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`);
        params.set('cancel_url', `${this.frontendUrl()}/checkout?canceled=1`);
        params.set('metadata[orderId]', order.id);
        order.items.forEach((item, index) => {
            params.set(`line_items[${index}][quantity]`, String(item.quantity));
            params.set(`line_items[${index}][price_data][currency]`, 'usd');
            params.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitPrice));
            params.set(`line_items[${index}][price_data][product_data][name]`, item.name);
        });
        if (order.deliveryFee > 0) {
            const index = order.items.length;
            params.set(`line_items[${index}][quantity]`, '1');
            params.set(`line_items[${index}][price_data][currency]`, 'usd');
            params.set(`line_items[${index}][price_data][unit_amount]`, String(order.deliveryFee));
            params.set(`line_items[${index}][price_data][product_data][name]`, 'Delivery fee');
        }
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.stripeSecretKey()}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Stripe-Version': '2026-02-25.clover',
            },
            body: params,
        });
        const json = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(json?.error?.message || 'Unable to create Stripe checkout session');
        }
        return json;
    }
    async retrieveStripeCheckoutSession(sessionId) {
        const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.stripeSecretKey()}`,
                'Stripe-Version': '2026-02-25.clover',
            },
        });
        const json = await response.json();
        if (!response.ok) {
            throw new common_1.BadRequestException(json?.error?.message || 'Unable to verify Stripe checkout session');
        }
        return json;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map