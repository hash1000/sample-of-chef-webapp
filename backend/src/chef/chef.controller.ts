import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ChefOrdersQueryDto } from './dto/chef-orders-query.dto';
import { CreateMenuItemDto, ToggleAvailabilityDto, UpdateMenuItemDto } from './dto/menu.dto';
import { UpdateChefOrderStatusDto } from './dto/update-order-status.dto';
import { ChefService } from './chef.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.chef)
@Controller('chef')
export class ChefController {
  constructor(private readonly chef: ChefService) {}

  @Get('orders')
  listOrders(@Req() req: any, @Query() query: ChefOrdersQueryDto) {
    return this.chef.listOrders(req.user.id, query);
  }

  @Get('orders/:id')
  getOrder(@Req() req: any, @Param('id') id: string) {
    return this.chef.getOrder(req.user.id, id);
  }

  @Patch('orders/:id/status')
  updateStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateChefOrderStatusDto) {
    return this.chef.updateOrderStatus(req.user.id, id, dto);
  }

  @Get('menu')
  listMenu(@Req() req: any) {
    return this.chef.listMenu(req.user.id);
  }

  @Post('menu')
  createMenu(@Req() req: any, @Body() dto: CreateMenuItemDto) {
    return this.chef.createMenuItem(req.user.id, dto);
  }

  @Patch('menu/:id')
  updateMenu(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.chef.updateMenuItem(req.user.id, id, dto);
  }

  @Delete('menu/:id')
  deleteMenu(@Req() req: any, @Param('id') id: string) {
    return this.chef.deleteMenuItem(req.user.id, id);
  }

  @Patch('menu/:id/availability')
  toggleAvailability(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ToggleAvailabilityDto,
  ) {
    return this.chef.toggleAvailability(req.user.id, id, dto);
  }
}

