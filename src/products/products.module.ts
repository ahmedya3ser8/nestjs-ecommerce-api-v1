import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Brand } from '../brands/entities/brand.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Review } from '../reviews/entities/review.entity';
import { SubCategory } from '../sub-categories/entities/sub-category.entity';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, Brand, SubCategory, Review]),
    UsersModule,
    JwtModule,
    CloudinaryModule
  ]
})
export class ProductsModule {}
