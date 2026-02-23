import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';

import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [
    TypeOrmModule.forFeature([Brand]),
    MulterModule.register({
      storage: diskStorage({
        destination: './images/brands',
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
      limits: { fileSize: 1024 * 1024 * 1 } // 1MB
    }),
    UsersModule,
    JwtModule
  ]
})
export class BrandsModule {}
