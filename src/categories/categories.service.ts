import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  public async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File) {
    const existCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (existCategory) throw new ConflictException('Category name already exists');

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      image: file?.filename ?? null
    });
    await this.categoryRepository.save(category);

    return {
      status: 'success',
      message: 'category created successfully',
      data: category
    }
  }

  public async findAll(page: number = 1, limit: number = 10) {
    const categories = await this.categoryRepository.find({ 
      skip: (page - 1) * limit,
      take: limit,
      relations: ['subCategories'] 
    });
    return {
      status: 'success',
      message: 'category retrieved successfully',
      total: categories.length,
      data: categories
    }
  }

  public async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['subCategories'] });
    if (!category) throw new NotFoundException('Category not found');
    return {
      status: 'success',
      message: 'category retrieved successfully',
      data: category
    }
  }

  public async update(id: number, updateCategoryDto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    if (file && category.image) {
      const imagePath = join(process.cwd(), `./images/categories/${category.image}`);
      if (existsSync(imagePath)) unlinkSync(imagePath);
    }

    if (file) {
      category.image = file?.filename;
    }

    category.name = updateCategoryDto.name ?? category.name;
    category.description = updateCategoryDto.description ?? category.description;
    category.isActive = updateCategoryDto.isActive ?? category.isActive;

    await this.categoryRepository.save(category);

    return {
      status: 'success',
      message: 'category updated successfully',
      data: category
    }
  }

  public async remove(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    await this.categoryRepository.remove(category);

    return {
      status: 'success',
      message: 'category deleted successfully',
      data: null
    }
  }
}
