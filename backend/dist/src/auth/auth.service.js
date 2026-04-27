"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    users;
    jwt;
    config;
    prisma;
    constructor(users, jwt, config, prisma) {
        this.users = users;
        this.jwt = jwt;
        this.config = config;
        this.prisma = prisma;
    }
    saltRounds() {
        const rounds = Number(this.config.get('BCRYPT_SALT_ROUNDS') ?? 10);
        return Number.isFinite(rounds) && rounds >= 8 ? rounds : 10;
    }
    async signup(dto) {
        const passwordHash = await bcrypt.hash(dto.password, this.saltRounds());
        const user = await this.users.createUser({
            name: dto.name,
            email: dto.email.toLowerCase(),
            passwordHash,
            role: dto.role ?? client_1.Role.user,
        });
        const access_token = await this.signToken(user.id, user.role);
        return { access_token, user: this.users.sanitize(user) };
    }
    async registerRestaurant(dto) {
        const email = dto.email.toLowerCase();
        const existing = await this.users.findByEmail(email);
        if (existing) {
            throw new common_1.ConflictException('Email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, this.saltRounds());
        const user = await this.prisma.user.create({
            data: {
                name: dto.name.trim(),
                email,
                passwordHash,
                role: client_1.Role.chef,
                chefRestaurants: {
                    create: {
                        name: dto.restaurantName.trim(),
                        city: dto.city,
                        menuType: dto.menuType.trim(),
                        description: dto.description?.trim(),
                        status: client_1.RestaurantStatus.pending,
                        isActive: true,
                    },
                },
            },
        });
        const access_token = await this.signToken(user.id, user.role);
        return { access_token, user: this.users.sanitize(user) };
    }
    async login(dto) {
        const user = await this.users.findByEmail(dto.email.toLowerCase());
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const access_token = await this.signToken(user.id, user.role);
        return { access_token, user: this.users.sanitize(user) };
    }
    async signToken(userId, role) {
        const payload = { sub: userId, role };
        return this.jwt.signAsync(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map