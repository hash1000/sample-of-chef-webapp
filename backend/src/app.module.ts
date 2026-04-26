import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ChefModule } from './chef/chef.module';
import { OrdersModule } from './orders/orders.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    RestaurantsModule,
    OrdersModule,
    AdminModule,
    ChefModule,
  ],
})
export class AppModule {}
