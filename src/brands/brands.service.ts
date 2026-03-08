import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

import { Brand } from './entities/brand.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageType } from '../utils/types';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  public async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
    const existBrand = await this.brandRepository.findOne({ where: { name: createBrandDto.name } });
    if (existBrand) throw new ConflictException('brand name already exists');

    let image: ImageType | null = null;

    if (file) {
      const result = await this.cloudinaryService.uploadSingleImage(file, 'ecommerce/brands');
      image = {
        url: result.url,
        publicId: result.publicId
      }
    }

    const brand = this.brandRepository.create({
      ...createBrandDto,
      image
    });

    await this.brandRepository.save(brand);

    return {
      status: 'success',
      message: 'brand created successfully',
      data: brand
    }
  }

  public async findAll(page: number = 1, limit: number = 10) {
    const brands = await this.brandRepository.find({
      skip: (page - 1) * limit,
      take: limit
    });
    return {
      status: 'success',
      message: 'brand retrieved successfully',
      total: brands.length,
      data: brands
    }
  }

  public async findOne(id: number) {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('brand not found');
    return {
      status: 'success',
      message: 'brand retrieved successfully',
      data: brand
    }
  }

  public async update(id: number, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File) {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('brand not found');

    brand.name = updateBrandDto.name ?? brand.name;
    brand.description = updateBrandDto.description ?? brand.description;
    brand.isActive = updateBrandDto.isActive ?? brand.isActive;

    if (file) {
      if (brand.image?.publicId) {
        await this.cloudinaryService.deleteSingleImage(brand.image.publicId);
      }
      const result = await this.cloudinaryService.uploadSingleImage(file, 'ecommerce/brands');
      brand.image = {
        url: result.url,
        publicId: result.publicId
      }
    }

    await this.brandRepository.save(brand);

    return {
      status: 'success',
      message: 'brand updated successfully',
      data: brand
    }
  }

  public async remove(id: number) {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('brand not found');

    if (brand.image?.publicId) {
      try {
        await this.cloudinaryService.deleteSingleImage(brand.image.publicId);
      } catch (error) {
        throw new BadRequestException(`Failed to delete brand image: ${error.message}`);
      }
    }

    await this.brandRepository.remove(brand);

    return {
      status: 'success',
      message: 'brand deleted successfully',
      data: null
    }
  }
}
