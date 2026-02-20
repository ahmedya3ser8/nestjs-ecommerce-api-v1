import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product } from './entities/product.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { SubCategory } from 'src/sub-categories/entities/sub-category.entity';

import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, Brand, SubCategory]),
    MulterModule.register({
      storage: diskStorage({
        destination: './images/products',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
          const fileName = `${prefix}-${file.originalname}`;
          cb(null, fileName);
        }
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('UnSupported file formate'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 5 } // 5MB
    })
  ]
})
export class ProductsModule {}
