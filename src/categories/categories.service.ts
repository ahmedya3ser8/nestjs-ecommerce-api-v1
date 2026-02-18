import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  public async create(createCategoryDto: CreateCategoryDto) {
    const existCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (existCategory) throw new ConflictException('Category name already exists');

    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    return {
      status: 'success',
      message: 'category created successfully',
      data: category
    }
  }

  public async findAll() {
    const categories = await this.categoryRepository.find({ relations: ['subCategories'] });
    return {
      status: 'success',
      message: 'category retrieved successfully',
      total: categories.length,
      data: categories
    }
  }

  public async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['subCategories'] });
    if (!category) throw new NotFoundException('category not found');
    return {
      status: 'success',
      message: 'category retrieved successfully',
      data: category
    }
  }

  public async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('category not found');

    category.name = updateCategoryDto.name ?? category.name;
    category.description = updateCategoryDto.description ?? category.description;
    category.image = updateCategoryDto.image ?? category.image;
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
    if (!category) throw new NotFoundException('category not found');

    await this.categoryRepository.remove(category);

    return {
      status: 'success',
      message: 'category deleted successfully',
      data: null
    }
  }
}
