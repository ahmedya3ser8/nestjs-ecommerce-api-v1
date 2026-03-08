import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageType } from '../utils/types';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  public async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File) {
    const existCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (existCategory) throw new ConflictException('Category name already exists');

    let image: ImageType | null = null;

    if (file) {
      const result = await this.cloudinaryService.uploadSingleImage(file, 'ecommerce/categories');
      image = {
        url: result.url,
        publicId: result.publicId
      }
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      image
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

    category.name = updateCategoryDto.name ?? category.name;
    category.description = updateCategoryDto.description ?? category.description;
    category.isActive = updateCategoryDto.isActive ?? category.isActive;

    if (file) {
      if (category.image?.publicId) {
        await this.cloudinaryService.deleteSingleImage(category.image.publicId);
      }
      const result = await this.cloudinaryService.uploadSingleImage(file, 'ecommerce/categories');
      category.image = {
        url: result.url,
        publicId: result.publicId
      }
    }

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

    if (category.image?.publicId) {
      try {
        await this.cloudinaryService.deleteSingleImage(category.image.publicId);
      } catch (error) {
        throw new BadRequestException(`Failed to delete category image: ${error.message}`);
      }
    }

    await this.categoryRepository.remove(category);

    return {
      status: 'success',
      message: 'category deleted successfully',
      data: null
    }
  }
}
