import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';

import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [
    TypeOrmModule.forFeature([Brand]),
    UsersModule,
    JwtModule,
    CloudinaryModule
  ]
})
export class BrandsModule {}
