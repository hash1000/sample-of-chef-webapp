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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const admin_service_1 = require("./admin.service");
const orders_filter_dto_1 = require("./dto/orders-filter.dto");
const pagination_dto_1 = require("./dto/pagination.dto");
const restaurants_dto_1 = require("./dto/restaurants.dto");
const roles_permissions_dto_1 = require("./dto/roles-permissions.dto");
let AdminController = class AdminController {
    admin;
    constructor(admin) {
        this.admin = admin;
    }
    dashboard() {
        return this.admin.dashboard();
    }
    listUsers(query) {
        return this.admin.listUsers(query);
    }
    blockUser(id) {
        return this.admin.blockUser(id, true);
    }
    unblockUser(id) {
        return this.admin.blockUser(id, false);
    }
    deleteUser(id) {
        return this.admin.deleteUser(id);
    }
    createRestaurant(dto) {
        return this.admin.createRestaurant(dto);
    }
    listRestaurants(query) {
        return this.admin.listRestaurants(query);
    }
    updateRestaurant(id, dto) {
        return this.admin.updateRestaurant(id, dto);
    }
    approveRestaurant(id) {
        return this.admin.setRestaurantStatus(id, client_1.RestaurantStatus.approved);
    }
    rejectRestaurant(id) {
        return this.admin.setRestaurantStatus(id, client_1.RestaurantStatus.rejected);
    }
    blockRestaurant(id) {
        return this.admin.setRestaurantStatus(id, client_1.RestaurantStatus.blocked);
    }
    unblockRestaurant(id) {
        return this.admin.setRestaurantStatus(id, client_1.RestaurantStatus.approved);
    }
    deleteRestaurant(id) {
        return this.admin.deleteRestaurant(id);
    }
    listOrders(query, filter) {
        return this.admin.listOrders(query, filter);
    }
    getOrder(id) {
        return this.admin.getOrder(id);
    }
    createRole(dto) {
        return this.admin.createAdminRole(dto);
    }
    listRoles() {
        return this.admin.listAdminRoles();
    }
    createPermission(dto) {
        return this.admin.createPermission(dto);
    }
    assignRole(dto) {
        return this.admin.assignRoleToUser(dto);
    }
    assignRolePermissions(dto) {
        return this.admin.assignPermissionsToRole(dto);
    }
    listPayments(query) {
        return this.admin.listPayments(query);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/block'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/unblock'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('restaurants'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restaurants_dto_1.CreateRestaurantDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createRestaurant", null);
__decorate([
    (0, common_1.Get)('restaurants'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listRestaurants", null);
__decorate([
    (0, common_1.Patch)('restaurants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, restaurants_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateRestaurant", null);
__decorate([
    (0, common_1.Patch)('restaurants/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveRestaurant", null);
__decorate([
    (0, common_1.Patch)('restaurants/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectRestaurant", null);
__decorate([
    (0, common_1.Patch)('restaurants/:id/block'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "blockRestaurant", null);
__decorate([
    (0, common_1.Patch)('restaurants/:id/unblock'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "unblockRestaurant", null);
__decorate([
    (0, common_1.Delete)('restaurants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteRestaurant", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, orders_filter_dto_1.AdminOrdersFilterDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Post)('roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roles_permissions_dto_1.CreateAdminRoleDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createRole", null);
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listRoles", null);
__decorate([
    (0, common_1.Post)('permissions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roles_permissions_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Post)('roles/assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roles_permissions_dto_1.AssignRoleToUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Post)('roles/permissions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roles_permissions_dto_1.AssignPermissionsToRoleDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "assignRolePermissions", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listPayments", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.admin),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map