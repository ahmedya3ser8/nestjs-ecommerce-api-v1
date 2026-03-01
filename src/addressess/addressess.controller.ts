import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';

import { CreateAddressessDto } from './dto/create-addressess.dto';
import { UpdateAddressessDto } from './dto/update-addressess.dto';

import { AddressessService } from './addressess.service';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import type { JwtPayload } from 'src/utils/types';

@Controller('api/v1/addressess')
export class AddressessController {
  constructor(private readonly addressessService: AddressessService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createAddressessDto: CreateAddressessDto, @CurrentUser() payload: JwtPayload) {
    return this.addressessService.create(createAddressessDto, payload.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() payload: JwtPayload) {
    return this.addressessService.findAll(payload.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAddressessDto: UpdateAddressessDto, @CurrentUser() payload: JwtPayload) {
    return this.addressessService.update(id, updateAddressessDto, payload.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() payload: JwtPayload) {
    return this.addressessService.remove(id, payload.id);
  }
}
