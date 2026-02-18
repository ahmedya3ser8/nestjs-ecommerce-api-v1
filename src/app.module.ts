import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './sub-categories/sub-categories.module';
import { BrandsModule } from './brands/brands.module';

import { Category } from './categories/entities/category.entity';
import { SubCategory } from './sub-categories/entities/sub-category.entity';
import { Brand } from './brands/entities/brand.entity';

@Module({
  imports: [
    CategoriesModule,
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
          entities: [Category, SubCategory, Brand]
        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    SubCategoriesModule,
    BrandsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
