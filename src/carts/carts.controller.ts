import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';

import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/user.decorator';
import type { JwtPayload } from '../utils/types';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Controller('api/v1/cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCartDto: CreateCartDto, @CurrentUser() payload: JwtPayload) {
    return this.cartsService.create(createCartDto, payload.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  find(@CurrentUser() payload: JwtPayload) {
    return this.cartsService.find(payload.id);
  }

  @Patch('coupon')
  @UseGuards(AuthGuard)
  appy(@Body() validateCouponDto: ValidateCouponDto, @CurrentUser() payload: JwtPayload) {
    return this.cartsService.applyCoupon(validateCouponDto, payload.id);
  }

  @Patch(':productId')
  @UseGuards(AuthGuard)
  update(@Param('productId', ParseIntPipe) productId: number, @Body() updateCartDto: UpdateCartDto, @CurrentUser() payload: JwtPayload) {
    return this.cartsService.update(productId, updateCartDto, payload.id);
  }

  @Delete(':productId')
  @UseGuards(AuthGuard)
  remove(@Param('productId', ParseIntPipe) productId: number, @CurrentUser() payload: JwtPayload) {
    return this.cartsService.remove(productId, payload.id);
  }

  @Delete()
  @UseGuards(AuthGuard)
  clear(@CurrentUser() payload: JwtPayload) {
    return this.cartsService.clearCart(payload.id);
  }
}
