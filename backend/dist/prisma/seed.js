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
const USER_EMAIL = 'user@chef.test';
const DEFAULT_PASSWORD = 'Password@12345';
async function upsertUser(data) {
    return prisma.user.upsert({
        where: { email: data.email },
        update: {
            name: data.name,
            passwordHash: data.passwordHash,
            role: data.role,
            isBlocked: data.isBlocked ?? false,
            adminRoleId: data.adminRoleId,
        },
        create: data,
    });
}
async function upsertRestaurant(data) {
    const existing = await prisma.restaurant.findFirst({ where: { name: data.name } });
    const restaurantData = {
        city: data.city,
        rating: data.rating,
        status: data.status,
        menuType: data.menuType,
        description: data.description,
        isActive: data.isActive ??
            (data.status !== client_1.RestaurantStatus.blocked && data.status !== client_1.RestaurantStatus.rejected),
        chefId: data.chefId,
    };
    if (existing) {
        return prisma.restaurant.update({
            where: { id: existing.id },
            data: restaurantData,
        });
    }
    return prisma.restaurant.create({
        data: {
            name: data.name,
            ...restaurantData,
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
        ['restaurants.manage', 'Approve, block, and update restaurants'],
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
    const admin = await upsertUser({
        name: 'Test Admin',
        email: ADMIN_EMAIL,
        passwordHash: adminPasswordHash,
        role: client_1.Role.admin,
        adminRoleId: superAdminRole.id,
    });
    const customer = await upsertUser({
        name: 'Sample Customer',
        email: USER_EMAIL,
        passwordHash,
        role: client_1.Role.user,
    });
    const blockedCustomer = await upsertUser({
        name: 'Blocked Customer',
        email: 'blocked@chef.test',
        passwordHash,
        role: client_1.Role.user,
        isBlocked: true,
    });
    const lahoreChef = await upsertUser({
        name: 'Lahore Chef',
        email: 'lahore.chef@chef.test',
        passwordHash,
        role: client_1.Role.chef,
    });
    const karachiChef = await upsertUser({
        name: 'Karachi Chef',
        email: 'karachi.chef@chef.test',
        passwordHash,
        role: client_1.Role.chef,
    });
    const islamabadChef = await upsertUser({
        name: 'Islamabad Chef',
        email: 'islamabad.chef@chef.test',
        passwordHash,
        role: client_1.Role.chef,
    });
    const pendingChef = await upsertUser({
        name: 'Pending Chef',
        email: 'pending.chef@chef.test',
        passwordHash,
        role: client_1.Role.chef,
    });
    const rejectedChef = await upsertUser({
        name: 'Rejected Chef',
        email: 'rejected.chef@chef.test',
        passwordHash,
        role: client_1.Role.chef,
    });
    const blockedChef = await upsertUser({
        name: 'Blocked Chef',
        email: 'blocked.chef@chef.test',
        passwordHash,
        role: client_1.Role.chef,
    });
    const spiceKitchen = await upsertRestaurant({
        name: 'Spice Kitchen Lahore',
        city: client_1.City.lahore,
        rating: 4.8,
        status: client_1.RestaurantStatus.approved,
        menuType: 'Pakistani',
        description: 'Lahore-style biryani, karahi, and tandoor favorites.',
        chefId: lahoreChef.id,
    });
    const seaSalt = await upsertRestaurant({
        name: 'Sea Salt Karachi',
        city: client_1.City.karachi,
        rating: 4.7,
        status: client_1.RestaurantStatus.approved,
        menuType: 'Seafood',
        description: 'Karachi seafood plates, rolls, and coastal grills.',
        chefId: karachiChef.id,
    });
    const capitalGrill = await upsertRestaurant({
        name: 'Capital Grill Islamabad',
        city: client_1.City.islamabad,
        rating: 4.6,
        status: client_1.RestaurantStatus.approved,
        menuType: 'Grill',
        description: 'Grilled mains, salads, and family platters in Islamabad.',
        chefId: islamabadChef.id,
    });
    await upsertRestaurant({
        name: 'Pending Tandoor Request',
        city: client_1.City.lahore,
        rating: 0,
        status: client_1.RestaurantStatus.pending,
        menuType: 'Tandoor',
        description: 'Admin approval test restaurant.',
        chefId: pendingChef.id,
    });
    await upsertRestaurant({
        name: 'Rejected Roll House',
        city: client_1.City.karachi,
        rating: 2.4,
        status: client_1.RestaurantStatus.rejected,
        menuType: 'Fast Food',
        description: 'Rejected registration sample for admin testing.',
        chefId: rejectedChef.id,
    });
    await upsertRestaurant({
        name: 'Blocked BBQ Spot',
        city: client_1.City.islamabad,
        rating: 3.1,
        status: client_1.RestaurantStatus.blocked,
        menuType: 'BBQ',
        description: 'Blocked restaurant sample for admin testing.',
        chefId: blockedChef.id,
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
    const fish = await upsertMenuItem({
        restaurantId: seaSalt.id,
        name: 'Masala Fish',
        priceCents: 1699,
        category: 'Seafood',
        description: 'Crisp fried fish with house masala and chutney.',
    });
    await upsertMenuItem({
        restaurantId: seaSalt.id,
        name: 'Zinger Roll',
        priceCents: 899,
        category: 'Wraps',
        description: 'Spicy crispy chicken roll with garlic mayo.',
    });
    const platter = await upsertMenuItem({
        restaurantId: capitalGrill.id,
        name: 'Mixed Grill Platter',
        priceCents: 2499,
        category: 'Grill',
        description: 'Chicken tikka, kebab, grilled vegetables, and rice.',
    });
    await upsertMenuItem({
        restaurantId: capitalGrill.id,
        name: 'Harvest Salad',
        priceCents: 1099,
        category: 'Salad',
        description: 'Greens, grilled vegetables, chickpeas, and house dressing.',
    });
    await prisma.order.deleteMany({
        where: { userId: { in: [customer.id, blockedCustomer.id] } },
    });
    const lahoreTotal = biryani.priceCents * 2 + karahi.priceCents + 499;
    await prisma.order.create({
        data: {
            userId: customer.id,
            restaurantId: spiceKitchen.id,
            status: client_1.OrderStatus.accepted,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: '03001234567',
            deliveryAddress: 'House 12, Test Street, Lahore',
            paymentMethod: 'mock',
            subtotal: biryani.priceCents * 2 + karahi.priceCents,
            deliveryFee: 499,
            total: lahoreTotal,
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
                    amount: lahoreTotal,
                    currency: 'usd',
                },
            },
        },
    });
    const karachiTotal = fish.priceCents * 2 + 499;
    await prisma.order.create({
        data: {
            userId: customer.id,
            restaurantId: seaSalt.id,
            status: client_1.OrderStatus.ready,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: '03001234567',
            deliveryAddress: 'Apartment 8, Sample Avenue, Karachi',
            paymentMethod: 'stripe',
            subtotal: fish.priceCents * 2,
            deliveryFee: 499,
            total: karachiTotal,
            items: {
                create: [
                    {
                        name: fish.name,
                        quantity: 2,
                        unitPrice: fish.priceCents,
                        lineTotal: fish.priceCents * 2,
                    },
                ],
            },
            payment: {
                create: {
                    provider: 'stripe',
                    stripeIntentId: 'pi_seed_sample_001',
                    status: client_1.PaymentStatus.succeeded,
                    amount: karachiTotal,
                    currency: 'usd',
                },
            },
        },
    });
    const islamabadTotal = platter.priceCents + 499;
    await prisma.order.create({
        data: {
            userId: customer.id,
            restaurantId: capitalGrill.id,
            status: client_1.OrderStatus.delivered,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: '03001234567',
            deliveryAddress: 'Street 22, F-7, Islamabad',
            paymentMethod: 'mock',
            subtotal: platter.priceCents,
            deliveryFee: 499,
            total: islamabadTotal,
            items: {
                create: [
                    {
                        name: platter.name,
                        quantity: 1,
                        unitPrice: platter.priceCents,
                        lineTotal: platter.priceCents,
                    },
                ],
            },
            payment: {
                create: {
                    provider: 'mock',
                    status: client_1.PaymentStatus.succeeded,
                    amount: islamabadTotal,
                    currency: 'usd',
                },
            },
        },
    });
    console.log('Seed complete');
    console.log(`Admin login: ${admin.email} / ${ADMIN_PASSWORD}`);
    console.log(`User login: ${customer.email} / ${DEFAULT_PASSWORD}`);
    console.log(`Approved chef logins: lahore.chef@chef.test, karachi.chef@chef.test, islamabad.chef@chef.test / ${DEFAULT_PASSWORD}`);
    console.log(`Pending chef login: pending.chef@chef.test / ${DEFAULT_PASSWORD}`);
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