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
exports.RestaurantsController = void 0;
const common_1 = require("@nestjs/common");
const restaurants_query_dto_1 = require("./dto/restaurants-query.dto");
const restaurants_service_1 = require("./restaurants.service");
let RestaurantsController = class RestaurantsController {
    restaurants;
    constructor(restaurants) {
        this.restaurants = restaurants;
    }
    list(query) {
        return this.restaurants.list(query);
    }
    get(id) {
        return this.restaurants.get(id);
    }
};
exports.RestaurantsController = RestaurantsController;
__decorate([
    (0, common_1.Get)('restaurants'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restaurants_query_dto_1.RestaurantsQueryDto]),
    __metadata("design:returntype", void 0)
], RestaurantsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('restaurant/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RestaurantsController.prototype, "get", null);
exports.RestaurantsController = RestaurantsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsController);
//# sourceMappingURL=restaurants.controller.js.map