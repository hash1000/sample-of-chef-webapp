import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.orders.createForUser(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @Get('user')
  async listMine(@Req() req: any) {
    return this.orders.listForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @Get(':id')
  async getMine(@Req() req: any, @Param('id') id: string) {
    return this.orders.getForUser(req.user.id, id);
  }
}

