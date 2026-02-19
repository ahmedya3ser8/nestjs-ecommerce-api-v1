import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

import { join } from 'path';
import { unlinkSync } from 'fs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private readonly brandRepository: Repository<Brand>) {}

  public async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
    const existBrand = await this.brandRepository.findOne({ where: { name: createBrandDto.name } });
    if (existBrand) throw new ConflictException('brand name already exists');

    const brand = this.brandRepository.create({
      ...createBrandDto,
      image: file?.filename ?? null
    });
    await this.brandRepository.save(brand);

    return {
      status: 'success',
      message: 'brand created successfully',
      data: brand
    }
  }

  public async findAll() {
    const brands = await this.brandRepository.find();
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

    if (file && brand.image) {
      const imagePath = join(process.cwd(), `./images/brands/${brand.image}`);
      unlinkSync(imagePath);
    }

    if (file) {
      brand.image = file?.filename;
    }

    brand.name = updateBrandDto.name ?? brand.name;
    brand.description = updateBrandDto.description ?? brand.description;
    brand.isActive = updateBrandDto.isActive ?? brand.isActive;

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

    await this.brandRepository.remove(brand);

    return {
      status: 'success',
      message: 'brand deleted successfully',
      data: null
    }
  }
}
