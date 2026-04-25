import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { AdminOrdersFilterDto } from './dto/orders-filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurants.dto';
import {
  AssignPermissionsToRoleDto,
  AssignRoleToUserDto,
  CreateAdminRoleDto,
  CreatePermissionDto,
} from './dto/roles-permissions.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  @Get('users')
  listUsers(@Query() query: PaginationDto) {
    return this.admin.listUsers(query);
  }

  @Patch('users/:id/block')
  blockUser(@Param('id') id: string) {
    return this.admin.blockUser(id, true);
  }

  @Patch('users/:id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.admin.blockUser(id, false);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.admin.deleteUser(id);
  }

  @Post('restaurants')
  createRestaurant(@Body() dto: CreateRestaurantDto) {
    return this.admin.createRestaurant(dto);
  }

  @Get('restaurants')
  listRestaurants(@Query() query: PaginationDto) {
    return this.admin.listRestaurants(query);
  }

  @Patch('restaurants/:id')
  updateRestaurant(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
    return this.admin.updateRestaurant(id, dto);
  }

  @Delete('restaurants/:id')
  deleteRestaurant(@Param('id') id: string) {
    return this.admin.deleteRestaurant(id);
  }

  @Get('orders')
  listOrders(@Query() query: PaginationDto, @Query() filter: AdminOrdersFilterDto) {
    return this.admin.listOrders(query, filter);
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.admin.getOrder(id);
  }

  @Post('roles')
  createRole(@Body() dto: CreateAdminRoleDto) {
    return this.admin.createAdminRole(dto);
  }

  @Get('roles')
  listRoles() {
    return this.admin.listAdminRoles();
  }

  @Post('permissions')
  createPermission(@Body() dto: CreatePermissionDto) {
    return this.admin.createPermission(dto);
  }

  @Post('roles/assign')
  assignRole(@Body() dto: AssignRoleToUserDto) {
    return this.admin.assignRoleToUser(dto);
  }

  @Post('roles/permissions')
  assignRolePermissions(@Body() dto: AssignPermissionsToRoleDto) {
    return this.admin.assignPermissionsToRole(dto);
  }

  @Get('payments')
  listPayments(@Query() query: PaginationDto) {
    return this.admin.listPayments(query);
  }
}

