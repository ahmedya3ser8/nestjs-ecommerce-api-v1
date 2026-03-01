import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { AddressessModule } from './addressess/addressess.module';
import { CouponsModule } from './coupons/coupons.module';
import { CartsModule } from './carts/carts.module';

import { Category } from './categories/entities/category.entity';
import { SubCategory } from './sub-categories/entities/sub-category.entity';
import { Brand } from './brands/entities/brand.entity';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities/user.entity';
import { Review } from './reviews/entities/review.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Addressess } from './addressess/entities/addressess.entity';
import { Coupon } from './coupons/entities/coupon.entity';
import { Cart } from './carts/entities/cart.entity';
import { CartItem } from './carts/entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: 'localhost',
          database: config.get<string>('DB_DATABASE'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          port: config.get<number>('DB_PORT'),
          synchronize: process.env.NODE_ENV !== 'production',
          entities: [Category, SubCategory, Brand, Product, User, Review, Wishlist, Addressess, Coupon, Cart, CartItem]
        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    CategoriesModule,
    SubCategoriesModule,
    BrandsModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    MailModule,
    ReviewsModule,
    WishlistsModule,
    AddressessModule,
    CouponsModule,
    CartsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {}
