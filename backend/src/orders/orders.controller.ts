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

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return this.orders.createGuest(dto);
  }

  @Post(':id/confirm-payment')
  async confirmPayment(@Param('id') id: string, @Body() dto: { sessionId: string }) {
    return this.orders.confirmStripePayment(id, dto.sessionId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @Get('user')
  async listMine(@Req() req: any) {
    return this.orders.listForUser(req.user.id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.orders.getPublic(id);
  }
}

