import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';

import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Controller('api/v1/subcategories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoriesService.create(createSubCategoryDto);
  }

  @Get()
  findAll() {
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoriesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    return this.subCategoriesService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoriesService.remove(id);
  }
}
