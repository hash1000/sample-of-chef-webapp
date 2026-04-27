import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RestaurantsQueryDto } from './dto/restaurants-query.dto';

function pageParams(query: RestaurantsQueryDto) {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 20));
  return { page, limit, skip: (page - 1) * limit };
}

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: RestaurantsQueryDto) {
    const { page, limit, skip } = pageParams(query);
    const q = query.q?.trim();
    const category = query.category?.trim();

    const where = {
      isActive: true,
      status: RestaurantStatus.approved,
      ...(query.city ? { city: query.city } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              {
                menuItems: {
                  some: { name: { contains: q, mode: 'insensitive' as const } },
                },
              },
            ],
          }
        : {}),
      ...(category
        ? {
            menuItems: {
              some: { category: { contains: category, mode: 'insensitive' as const } },
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

  async get(id: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id, isActive: true, status: RestaurantStatus.approved },
      include: {
        chef: { select: { id: true, name: true } },
        menuItems: { orderBy: [{ category: 'asc' }, { name: 'asc' }] },
      },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }
}
