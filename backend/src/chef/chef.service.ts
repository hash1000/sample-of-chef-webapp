import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MenuItem, OrderStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChefOrdersQueryDto } from './dto/chef-orders-query.dto';
import { CreateMenuItemDto, ToggleAvailabilityDto, UpdateMenuItemDto } from './dto/menu.dto';
import { UpdateChefOrderStatusDto } from './dto/update-order-status.dto';

function pageParams(q: { page?: number; limit?: number }) {
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(100, Math.max(1, q.limit ?? 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

@Injectable()
export class ChefService {
  constructor(private readonly prisma: PrismaService) {}

  private async getChefRestaurantOrThrow(chefId: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { chefId },
    });
    if (!restaurant) throw new ForbiddenException('Chef has no assigned restaurant');
    return restaurant;
  }

  async listOrders(chefId: string, query: ChefOrdersQueryDto) {
    const restaurant = await this.getChefRestaurantOrThrow(chefId);
    const { page, limit, skip } = pageParams(query);

    const statusWhere =
      query.status === 'completed'
        ? { in: [OrderStatus.delivered] }
        : query.status
          ? { equals: query.status as any }
          : undefined;

    const where: any = {
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

  async getOrder(chefId: string, orderId: string) {
    const restaurant = await this.getChefRestaurantOrThrow(chefId);
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { id: true, name: true, email: true } }, items: true, payment: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.restaurantId !== restaurant.id) throw new ForbiddenException('Forbidden');
    return order;
  }

  async updateOrderStatus(chefId: string, orderId: string, dto: UpdateChefOrderStatusDto) {
    const restaurant = await this.getChefRestaurantOrThrow(chefId);
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.restaurantId !== restaurant.id) throw new ForbiddenException('Forbidden');

    const from = order.status;
    const to = dto.status as any as OrderStatus;

    const allowed =
      (from === OrderStatus.pending && to === OrderStatus.accepted) ||
      (from === OrderStatus.accepted && to === OrderStatus.preparing) ||
      (from === OrderStatus.preparing && to === OrderStatus.ready);

    if (!allowed) {
      throw new BadRequestException(`Invalid status transition: ${from} -> ${to}`);
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: to },
    });
  }

  async listMenu(chefId: string) {
    const restaurant = await this.getChefRestaurantOrThrow(chefId);
    return this.prisma.menuItem.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMenuItem(chefId: string, dto: CreateMenuItemDto): Promise<MenuItem> {
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

  async updateMenuItem(chefId: string, id: string, dto: UpdateMenuItemDto) {
    const restaurant = await this.getChefRestaurantOrThrow(chefId);
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    if (item.restaurantId !== restaurant.id) throw new ForbiddenException('Forbidden');

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

  async deleteMenuItem(chefId: string, id: string) {
    const restaurant = await this.getChefRestaurantOrThrow(chefId);
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    if (item.restaurantId !== restaurant.id) throw new ForbiddenException('Forbidden');

    await this.prisma.menuItem.delete({ where: { id } });
    return { ok: true };
  }

  async toggleAvailability(chefId: string, id: string, dto: ToggleAvailabilityDto) {
    const restaurant = await this.getChefRestaurantOrThrow(chefId);
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    if (item.restaurantId !== restaurant.id) throw new ForbiddenException('Forbidden');

    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: dto.isAvailable },
    });
  }
}

