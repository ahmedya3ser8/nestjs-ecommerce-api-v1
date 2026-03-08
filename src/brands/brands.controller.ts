import { 
  Body, 
  Controller,
  Delete, 
  Get, 
  Param, 
  ParseIntPipe, 
  Patch, 
  Post, 
  Query, 
  UploadedFile, 
  UseGuards, 
  UseInterceptors 
} from '@nestjs/common';

import { ImageUploadInterceptor } from '../utils/interceptors/image-upload.interceptor';
import { Roles } from '../users/decorators/roles.decorator';

import { AuthGuard } from '../users/guards/auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';

import { UserRole } from '../utils/enums';
import { BrandsService } from './brands.service';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('api/v1/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(ImageUploadInterceptor('image', 5))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createBrandDto: CreateBrandDto, @UploadedFile() file: Express.Multer.File) {
    return this.brandsService.create(createBrandDto, file);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.brandsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(ImageUploadInterceptor('image', 5))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBrandDto: UpdateBrandDto, @UploadedFile() file?: Express.Multer.File) {
    return this.brandsService.update(id, updateBrandDto, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.remove(id);
  }
}
