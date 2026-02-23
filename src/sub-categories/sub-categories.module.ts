import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { UsersModule } from 'src/users/users.module';

import { SubCategory } from './entities/sub-category.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
  imports: [TypeOrmModule.forFeature([SubCategory, Category]), UsersModule, JwtModule]
})
export class SubCategoriesModule {}
