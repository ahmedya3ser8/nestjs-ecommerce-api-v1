import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFiles, Query, UseGuards } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { UserRole } from 'src/utils/enums';
import { Roles } from 'src/users/decorators/roles.decorator';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: { imageCover?: Express.Multer.File[]; images?: Express.Multer.File[] } ) {
    return this.productsService.create(createProductDto, files);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get(':productId/reviews')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllReviewsByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.findAllReviewsByProductId(productId);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() files: { imageCover?: Express.Multer.File[]; images?: Express.Multer.File[] }) {
    return this.productsService.update(id, updateProductDto, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
