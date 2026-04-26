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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const ADMIN_EMAIL = 'admin@chef.test';
const ADMIN_PASSWORD = 'Admin@12345';
const CHEF_EMAIL = 'chef@chef.test';
const USER_EMAIL = 'user@chef.test';
const DEFAULT_PASSWORD = 'Password@12345';
async function upsertRestaurant(data) {
    const existing = await prisma.restaurant.findFirst({ where: { name: data.name } });
    if (existing) {
        return prisma.restaurant.update({
            where: { id: existing.id },
            data: {
                rating: data.rating,
                isActive: data.isActive ?? true,
                chefId: data.chefId,
            },
        });
    }
    return prisma.restaurant.create({
        data: {
            name: data.name,
            rating: data.rating,
            isActive: data.isActive ?? true,
            chefId: data.chefId,
        },
    });
}
async function upsertMenuItem(data) {
    const existing = await prisma.menuItem.findFirst({
        where: { restaurantId: data.restaurantId, name: data.name },
    });
    if (existing) {
        return prisma.menuItem.update({
            where: { id: existing.id },
            data: {
                priceCents: data.priceCents,
                category: data.category,
                description: data.description,
                isAvailable: data.isAvailable ?? true,
            },
        });
    }
    return prisma.menuItem.create({ data: { ...data, isAvailable: data.isAvailable ?? true } });
}
async function main() {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const permissions = await Promise.all([
        ['dashboard.read', 'View admin dashboard metrics'],
        ['users.manage', 'Block, unblock, and review users'],
        ['restaurants.manage', 'Create and update restaurants'],
        ['orders.manage', 'Review and update all orders'],
        ['payments.read', 'Review payment records'],
        ['roles.manage', 'Manage admin roles and permissions'],
    ].map(([key, description]) => prisma.permission.upsert({
        where: { key },
        update: { description },
        create: { key, description },
    })));
    const superAdminRole = await prisma.adminRole.upsert({
        where: { name: 'Super Admin' },
        update: {},
        create: { name: 'Super Admin' },
    });
    await prisma.rolePermission.createMany({
        data: permissions.map((permission) => ({
            roleId: superAdminRole.id,
            permissionId: permission.id,
        })),
        skipDuplicates: true,
    });
    const admin = await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {
            name: 'Test Admin',
            passwordHash: adminPasswordHash,
            role: client_1.Role.admin,
            isBlocked: false,
            adminRoleId: superAdminRole.id,
        },
        create: {
            name: 'Test Admin',
            email: ADMIN_EMAIL,
            passwordHash: adminPasswordHash,
            role: client_1.Role.admin,
            adminRoleId: superAdminRole.id,
        },
    });
    const chef = await prisma.user.upsert({
        where: { email: CHEF_EMAIL },
        update: {
            name: 'Sample Chef',
            passwordHash,
            role: client_1.Role.chef,
            isBlocked: false,
        },
        create: {
            name: 'Sample Chef',
            email: CHEF_EMAIL,
            passwordHash,
            role: client_1.Role.chef,
        },
    });
    const customer = await prisma.user.upsert({
        where: { email: USER_EMAIL },
        update: {
            name: 'Sample Customer',
            passwordHash,
            role: client_1.Role.user,
            isBlocked: false,
        },
        create: {
            name: 'Sample Customer',
            email: USER_EMAIL,
            passwordHash,
            role: client_1.Role.user,
        },
    });
    const blockedCustomer = await prisma.user.upsert({
        where: { email: 'blocked@chef.test' },
        update: {
            name: 'Blocked Customer',
            passwordHash,
            role: client_1.Role.user,
            isBlocked: true,
        },
        create: {
            name: 'Blocked Customer',
            email: 'blocked@chef.test',
            passwordHash,
            role: client_1.Role.user,
            isBlocked: true,
        },
    });
    const spiceKitchen = await upsertRestaurant({
        name: 'Spice Kitchen',
        rating: 4.8,
        chefId: chef.id,
    });
    const greenBowl = await upsertRestaurant({
        name: 'Green Bowl',
        rating: 4.5,
        chefId: chef.id,
    });
    const biryani = await upsertMenuItem({
        restaurantId: spiceKitchen.id,
        name: 'Chicken Biryani',
        priceCents: 1299,
        category: 'Rice',
        description: 'Fragrant basmati rice layered with spiced chicken.',
    });
    const karahi = await upsertMenuItem({
        restaurantId: spiceKitchen.id,
        name: 'Chicken Karahi',
        priceCents: 1899,
        category: 'Curry',
        description: 'Tomato based karahi with fresh ginger and green chilies.',
    });
    await upsertMenuItem({
        restaurantId: spiceKitchen.id,
        name: 'Garlic Naan',
        priceCents: 299,
        category: 'Bread',
        description: 'Tandoor baked naan brushed with garlic butter.',
    });
    const salad = await upsertMenuItem({
        restaurantId: greenBowl.id,
        name: 'Harvest Salad',
        priceCents: 1099,
        category: 'Salad',
        description: 'Greens, grilled vegetables, chickpeas, and house dressing.',
    });
    await upsertMenuItem({
        restaurantId: greenBowl.id,
        name: 'Lentil Soup',
        priceCents: 799,
        category: 'Soup',
        description: 'Slow cooked lentils with herbs and lemon.',
    });
    await prisma.order.deleteMany({
        where: { userId: { in: [customer.id, blockedCustomer.id] } },
    });
    await prisma.order.create({
        data: {
            userId: customer.id,
            restaurantId: spiceKitchen.id,
            status: client_1.OrderStatus.accepted,
            deliveryAddress: 'House 12, Test Street, Lahore',
            paymentMethod: 'mock',
            subtotal: biryani.priceCents * 2 + karahi.priceCents,
            deliveryFee: 499,
            total: biryani.priceCents * 2 + karahi.priceCents + 499,
            items: {
                create: [
                    {
                        name: biryani.name,
                        quantity: 2,
                        unitPrice: biryani.priceCents,
                        lineTotal: biryani.priceCents * 2,
                    },
                    {
                        name: karahi.name,
                        quantity: 1,
                        unitPrice: karahi.priceCents,
                        lineTotal: karahi.priceCents,
                    },
                ],
            },
            payment: {
                create: {
                    provider: 'mock',
                    status: client_1.PaymentStatus.succeeded,
                    amount: biryani.priceCents * 2 + karahi.priceCents + 499,
                    currency: 'usd',
                },
            },
        },
    });
    await prisma.order.create({
        data: {
            userId: customer.id,
            restaurantId: greenBowl.id,
            status: client_1.OrderStatus.delivered,
            deliveryAddress: 'Apartment 8, Sample Avenue, Karachi',
            paymentMethod: 'stripe',
            subtotal: salad.priceCents * 3,
            deliveryFee: 499,
            total: salad.priceCents * 3 + 499,
            items: {
                create: [
                    {
                        name: salad.name,
                        quantity: 3,
                        unitPrice: salad.priceCents,
                        lineTotal: salad.priceCents * 3,
                    },
                ],
            },
            payment: {
                create: {
                    provider: 'stripe',
                    stripeIntentId: 'pi_seed_sample_001',
                    status: client_1.PaymentStatus.succeeded,
                    amount: salad.priceCents * 3 + 499,
                    currency: 'usd',
                },
            },
        },
    });
    console.log('Seed complete');
    console.log(`Admin login: ${admin.email} / ${ADMIN_PASSWORD}`);
    console.log(`Chef login: ${chef.email} / ${DEFAULT_PASSWORD}`);
    console.log(`User login: ${customer.email} / ${DEFAULT_PASSWORD}`);
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map