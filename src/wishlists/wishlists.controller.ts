import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';

import { WishlistsService } from './wishlists.service';
import { CurrentUser } from 'src/users/decorators/user.decorator';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import type { JwtPayload } from 'src/utils/types';

@Controller('api/v1/wishlist')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createWishlistDto: CreateWishlistDto, @CurrentUser() payload: JwtPayload) {
    return this.wishlistsService.create(createWishlistDto, payload.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  find(@Query('page') page: number, @Query('limit') limit: number) {
    return this.wishlistsService.find(page, limit);
  }
  
  @Delete(':productId')
  @UseGuards(AuthGuard)
  remove(@Param('productId', ParseIntPipe) productId: number, @CurrentUser() payload: JwtPayload) {
    return this.wishlistsService.remove(productId, payload.id);
  }
}
