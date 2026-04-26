import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: string, dto: CreateOrderDto): Promise<Order> {
    const menuItemIds = dto.items.map((item) => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true, restaurant: { isActive: true } },
      include: { restaurant: true },
    });
    const menuById = new Map(menuItems.map((item) => [item.id, item]));

    if (menuItems.length !== new Set(menuItemIds).size) {
      throw new BadRequestException('One or more menu items are unavailable');
    }

    const restaurantId = dto.restaurantId ?? menuItems[0]?.restaurantId;
    if (!restaurantId || menuItems.some((item) => item.restaurantId !== restaurantId)) {
      throw new BadRequestException('All items must belong to the same restaurant');
    }

    const subtotal = dto.items.reduce((sum, it) => {
      const menuItem = menuById.get(it.menuItemId);
      if (!menuItem) throw new BadRequestException('Invalid menu item');
      return sum + menuItem.priceCents * it.quantity;
    }, 0);
    const deliveryFee = subtotal >= 5000 ? 0 : 499;
    const total = subtotal + deliveryFee;

    return this.prisma.order.create({
      data: {
        userId,
        restaurantId,
        status: OrderStatus.pending,
        deliveryAddress: dto.deliveryAddress.trim(),
        paymentMethod: dto.paymentMethod ?? 'mock',
        subtotal,
        deliveryFee,
        total,
        items: {
          create: dto.items.map((it) => {
            const menuItem = menuById.get(it.menuItemId)!;
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
            status: PaymentStatus.succeeded,
            amount: total,
            currency: 'usd',
          },
        },
      },
      include: { items: true, payment: true, restaurant: true },
    });
  }

  async listForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true, restaurant: true, payment: true },
    });
  }

  async getForUser(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, restaurant: true, payment: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Forbidden');
    return order;
  }
}

