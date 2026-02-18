import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private readonly brandRepository: Repository<Brand>) {}

  public async create(createBrandDto: CreateBrandDto) {
    const existBrand = await this.brandRepository.findOne({ where: { name: createBrandDto.name } });
    if (existBrand) throw new ConflictException('brand name already exists');

    const brand = this.brandRepository.create(createBrandDto);
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

  public async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('brand not found');

    brand.name = updateBrandDto.name ?? brand.name;
    brand.description = updateBrandDto.description ?? brand.description;
    brand.image = updateBrandDto.image ?? brand.image;
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
