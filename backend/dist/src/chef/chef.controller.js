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
exports.ChefController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const client_1 = require("@prisma/client");
const local_image_upload_1 = require("../common/local-image-upload");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const chef_orders_query_dto_1 = require("./dto/chef-orders-query.dto");
const menu_dto_1 = require("./dto/menu.dto");
const restaurant_dto_1 = require("./dto/restaurant.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const chef_service_1 = require("./chef.service");
let ChefController = class ChefController {
    chef;
    constructor(chef) {
        this.chef = chef;
    }
    getRestaurant(req) {
        return this.chef.getRestaurant(req.user.id);
    }
    updateRestaurant(req, dto) {
        return this.chef.updateRestaurant(req.user.id, dto);
    }
    updateRestaurantBanner(req, file) {
        if (!file)
            throw new common_1.BadRequestException('Image file is required');
        return this.chef.updateRestaurantBanner(req.user.id, `/uploads/restaurants/${file.filename}`);
    }
    listOrders(req, query) {
        return this.chef.listOrders(req.user.id, query);
    }
    getOrder(req, id) {
        return this.chef.getOrder(req.user.id, id);
    }
    updateStatus(req, id, dto) {
        return this.chef.updateOrderStatus(req.user.id, id, dto);
    }
    listMenu(req) {
        return this.chef.listMenu(req.user.id);
    }
    createMenu(req, dto) {
        return this.chef.createMenuItem(req.user.id, dto);
    }
    updateMenu(req, id, dto) {
        return this.chef.updateMenuItem(req.user.id, id, dto);
    }
    updateMenuImage(req, id, file) {
        if (!file)
            throw new common_1.BadRequestException('Image file is required');
        return this.chef.updateMenuItemImage(req.user.id, id, `/uploads/menu-items/${file.filename}`);
    }
    deleteMenu(req, id) {
        return this.chef.deleteMenuItem(req.user.id, id);
    }
    toggleAvailability(req, id, dto) {
        return this.chef.toggleAvailability(req.user.id, id, dto);
    }
};
exports.ChefController = ChefController;
__decorate([
    (0, common_1.Get)('restaurant'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "getRestaurant", null);
__decorate([
    (0, common_1.Patch)('restaurant'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, restaurant_dto_1.UpdateChefRestaurantDto]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "updateRestaurant", null);
__decorate([
    (0, common_1.Patch)('restaurant/banner'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', (0, local_image_upload_1.localImageUploadOptions)('restaurants'))),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "updateRestaurantBanner", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, chef_orders_query_dto_1.ChefOrdersQueryDto]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_order_status_dto_1.UpdateChefOrderStatusDto]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('menu'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "listMenu", null);
__decorate([
    (0, common_1.Post)('menu'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, menu_dto_1.CreateMenuItemDto]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "createMenu", null);
__decorate([
    (0, common_1.Patch)('menu/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, menu_dto_1.UpdateMenuItemDto]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "updateMenu", null);
__decorate([
    (0, common_1.Patch)('menu/:id/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', (0, local_image_upload_1.localImageUploadOptions)('menu-items'))),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "updateMenuImage", null);
__decorate([
    (0, common_1.Delete)('menu/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "deleteMenu", null);
__decorate([
    (0, common_1.Patch)('menu/:id/availability'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, menu_dto_1.ToggleAvailabilityDto]),
    __metadata("design:returntype", void 0)
], ChefController.prototype, "toggleAvailability", null);
exports.ChefController = ChefController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.chef),
    (0, common_1.Controller)('chef'),
    __metadata("design:paramtypes", [chef_service_1.ChefService])
], ChefController);
//# sourceMappingURL=chef.controller.js.map