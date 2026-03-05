import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
import { OrdersModule } from './orders/orders.module';

import { dataSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV !== 'production' ? `.env.${process.env.NODE_ENV}` : '.env'
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
    CartsModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {}
