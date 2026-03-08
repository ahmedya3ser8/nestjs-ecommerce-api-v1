import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from '../users/users.module';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../carts/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Cart, CartItem, Product]),
    UsersModule,
    JwtModule
  ]
})
export class OrdersModule {}
