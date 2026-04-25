import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Role, RiderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdminOrdersFilterDto } from './dto/orders-filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurants.dto';
import {
  AssignPermissionsToRoleDto,
  AssignRoleToUserDto,
  CreateAdminRoleDto,
  CreatePermissionDto,
} from './dto/roles-permissions.dto';
import { UpdateRiderStatusDto } from './dto/riders.dto';

function paginate(q: PaginationDto) {
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(100, Math.max(1, q.limit ?? 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [totalUsers, totalRestaurants, totalOrders, revenueAgg] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.restaurant.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
    ]);

    return {
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue: revenueAgg._sum.total ?? 0,
    };
  }

  async listUsers(query: PaginationDto) {
    const { limit, skip, page } = paginate(query);
    const q = query.q?.trim();

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
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
          riderStatus: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async blockUser(userId: string, blocked = true) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked: blocked },
      select: { id: true, isBlocked: true },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id: userId } });
    return { ok: true };
  }

  async createRestaurant(dto: CreateRestaurantDto) {
    if (dto.chefId) {
      const chef = await this.prisma.user.findUnique({ where: { id: dto.chefId } });
      if (!chef) throw new BadRequestException('chefId not found');
      if (chef.role !== Role.chef) throw new BadRequestException('chefId must be a chef');
    }

    return this.prisma.restaurant.create({
      data: { name: dto.name, chefId: dto.chefId ?? null },
    });
  }

  async listRestaurants(query: PaginationDto) {
    const { limit, skip, page } = paginate(query);
    const q = query.q?.trim();
    const where = q ? { name: { contains: q, mode: 'insensitive' as const } } : {};

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

  async updateRestaurant(id: string, dto: UpdateRestaurantDto) {
    const existing = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Restaurant not found');

    if (dto.chefId !== undefined) {
      if (dto.chefId === null || dto.chefId === '') {
        // ok (unassign)
      } else {
        const chef = await this.prisma.user.findUnique({ where: { id: dto.chefId } });
        if (!chef) throw new BadRequestException('chefId not found');
        if (chef.role !== Role.chef) throw new BadRequestException('chefId must be a chef');
      }
    }

    return this.prisma.restaurant.update({
      where: { id },
      data: {
        name: dto.name,
        isActive: dto.isActive,
        chefId: dto.chefId === '' ? null : dto.chefId,
      },
      include: { chef: { select: { id: true, email: true, name: true } } },
    });
  }

  async deleteRestaurant(id: string) {
    const existing = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Restaurant not found');
    await this.prisma.restaurant.delete({ where: { id } });
    return { ok: true };
  }

  async listOrders(query: PaginationDto, filter: AdminOrdersFilterDto) {
    const { limit, skip, page } = paginate(query);
    const q = query.q?.trim();

    const createdAt: any = {};
    if (filter.from) createdAt.gte = new Date(filter.from);
    if (filter.to) createdAt.lte = new Date(filter.to);

    const where: any = {
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.from || filter.to ? { createdAt } : {}),
      ...(q
        ? {
            OR: [
              { id: { contains: q, mode: 'insensitive' as const } },
              { user: { email: { contains: q, mode: 'insensitive' as const } } },
              { user: { name: { contains: q, mode: 'insensitive' as const } } },
              { restaurant: { name: { contains: q, mode: 'insensitive' as const } } },
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

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        restaurant: { select: { id: true, name: true } },
        payment: true,
        items: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async listRiders(query: PaginationDto) {
    const { limit, skip, page } = paginate(query);
    const q = query.q?.trim();

    const where: any = {
      role: Role.rider,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              { email: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

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
          riderStatus: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async updateRiderStatus(id: string, dto: UpdateRiderStatusDto) {
    const rider = await this.prisma.user.findUnique({ where: { id } });
    if (!rider) throw new NotFoundException('Rider not found');
    if (rider.role !== Role.rider) throw new BadRequestException('User is not a rider');
    return this.prisma.user.update({
      where: { id },
      data: { riderStatus: dto.status ?? RiderStatus.offline },
      select: { id: true, riderStatus: true },
    });
  }

  async createAdminRole(dto: CreateAdminRoleDto) {
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

  async createPermission(dto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: { key: dto.key.trim(), description: dto.description?.trim() },
    });
  }

  async assignRoleToUser(dto: AssignRoleToUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.adminRole.findUnique({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role not found');

    return this.prisma.user.update({
      where: { id: dto.userId },
      data: { adminRoleId: dto.roleId },
      select: { id: true, adminRoleId: true },
    });
  }

  async assignPermissionsToRole(dto: AssignPermissionsToRoleDto) {
    const role = await this.prisma.adminRole.findUnique({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const existing = await this.prisma.permission.findMany({
      where: { id: { in: dto.permissionIds } },
      select: { id: true },
    });
    const okIds = new Set(existing.map((p: { id: string }) => p.id));
    const missing = dto.permissionIds.filter((id) => !okIds.has(id));
    if (missing.length) throw new BadRequestException(`Unknown permissionIds: ${missing.join(', ')}`);

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

  async listPayments(query: PaginationDto) {
    const { limit, skip, page } = paginate(query);
    const q = query.q?.trim();

    const where: any = q
      ? {
          OR: [
            { id: { contains: q, mode: 'insensitive' as const } },
            { stripeIntentId: { contains: q, mode: 'insensitive' as const } },
            { orderId: { contains: q, mode: 'insensitive' as const } },
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
}

