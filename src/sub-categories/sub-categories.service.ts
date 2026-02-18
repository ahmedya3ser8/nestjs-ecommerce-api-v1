import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

import { SubCategory } from './entities/sub-category.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory) private readonly subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {}

  public async create(createSubCategoryDto: CreateSubCategoryDto) {
    const { categoryId } = createSubCategoryDto;

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException(`Category with id ${categoryId} not found`);

    const subCategory = this.subCategoryRepository.create({
      ...createSubCategoryDto,
      category
    });
    
    await this.subCategoryRepository.save(subCategory);

    return {
      status: 'success',
      message: 'subCategory created successfully',
      data: subCategory
    }
  }

  public async findAll() {
    const subCategories = await this.subCategoryRepository.find();
    return {
      status: 'success',
      message: 'subCategory retrieved successfully',
      total: subCategories.length,
      data: subCategories
    }
  }

  public async findOne(id: number) {
    const subCategory = await this.subCategoryRepository.findOne({ where: { id } });
    if (!subCategory) throw new NotFoundException(`SubCategory with id ${id} not found`);
    return {
      status: 'success',
      message: 'subcategory retrieved successfully',
      data: subCategory
    }
  }

  public async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryRepository.findOne({ where: { id } });
    if (!subCategory) throw new NotFoundException('category not found');

    subCategory.name = updateSubCategoryDto.name ?? subCategory.name;
    subCategory.description = updateSubCategoryDto.description ?? subCategory.description;
    subCategory.isActive = updateSubCategoryDto.isActive ?? subCategory.isActive;

    if (updateSubCategoryDto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: updateSubCategoryDto.categoryId } });
      if (!category) throw new NotFoundException(`Category with id ${updateSubCategoryDto.categoryId} not found`);
      subCategory.category = category;
    }

    await this.subCategoryRepository.save(subCategory);

    return {
      status: 'success',
      message: 'subCategory updated successfully',
      data: subCategory
    }
  }

  public async remove(id: number) {
    const subCategory = await this.subCategoryRepository.findOne({ where: { id } });
    if (!subCategory) throw new NotFoundException(`SubCategory with id ${id} not found`);

    await this.subCategoryRepository.remove(subCategory);

    return {
      status: 'success',
      message: 'subcategory deleted successfully',
      data: null
    }
  }
}
