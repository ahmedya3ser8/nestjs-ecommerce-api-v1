import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { SubCategory } from 'src/sub-categories/entities/sub-category.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, Brand, SubCategory])
  ]
})
export class ProductsModule {}
