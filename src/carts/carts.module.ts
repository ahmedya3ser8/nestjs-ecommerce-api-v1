import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { UsersModule } from '../users/users.module';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { Coupon } from '../coupons/entities/coupon.entity';

@Module({
  controllers: [CartsController],
  providers: [CartsService],
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product, Coupon]),
    UsersModule,
    JwtModule
  ]
})
export class CartsModule {}
