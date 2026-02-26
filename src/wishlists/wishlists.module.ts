import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { UsersModule } from 'src/users/users.module';

import { Wishlist } from './entities/wishlist.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  imports: [
    TypeOrmModule.forFeature([Wishlist, Product]),
    UsersModule,
    JwtModule
  ]
})
export class WishlistsModule {}
