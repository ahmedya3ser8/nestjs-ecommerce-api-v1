import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AddressessService } from './addressess.service';
import { AddressessController } from './addressess.controller';
import { UsersModule } from 'src/users/users.module';

import { Addressess } from './entities/addressess.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [AddressessController],
  providers: [AddressessService],
  imports: [
    TypeOrmModule.forFeature([Addressess, User]),
    UsersModule,
    JwtModule
  ]
})
export class AddressessModule {}
