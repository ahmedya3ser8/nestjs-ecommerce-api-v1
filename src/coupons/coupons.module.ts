import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { Coupon } from './entities/coupon.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

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
