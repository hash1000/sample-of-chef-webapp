import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: string, dto: CreateOrderDto): Promise<Order> {
    const subtotal = dto.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    const total = subtotal + dto.deliveryFee;

    return this.prisma.order.create({
      data: {
        userId,
        restaurantId: dto.restaurantId ?? null,
        status: OrderStatus.pending,
        subtotal,
        deliveryFee: dto.deliveryFee,
        total,
        items: {
          create: dto.items.map((it) => ({
            name: it.name,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            lineTotal: it.unitPrice * it.quantity,
          })),
        },
      },
    });
  }

  async listForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async getForUser(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Forbidden');
    return order;
  }
}

