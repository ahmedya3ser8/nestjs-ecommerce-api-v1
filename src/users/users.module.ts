import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Review } from '../reviews/entities/review.entity';
import { User } from './entities/user.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, RolesGuard],
  exports: [UsersService, AuthGuard, RolesGuard],
  imports: [
    TypeOrmModule.forFeature([User, Review]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<number>('JWT_EXPIRES_IN')
          }
        }
      }
    }),
    CloudinaryModule
  ]
})
export class UsersModule {}
