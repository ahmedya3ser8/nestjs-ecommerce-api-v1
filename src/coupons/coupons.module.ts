import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { Coupon } from './entities/coupon.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CouponsController],
  providers: [CouponsService],
  imports: [
    TypeOrmModule.forFeature([Coupon]),
    UsersModule,
    JwtModule
  ]
})
export class CouponsModule {}
