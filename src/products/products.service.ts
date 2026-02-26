import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { SubCategory } from 'src/sub-categories/entities/sub-category.entity';
import { Review } from 'src/reviews/entities/review.entity';

import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    @InjectRepository(SubCategory) private readonly subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
  ) {}

  public async create(createProductDto: CreateProductDto, files: { imageCover?: Express.Multer.File[]; images?: Express.Multer.File[] } ) {
    const brand = await this.brandRepository.findOne({ where: { id: createProductDto.brandId } });
    if (!brand) throw new NotFoundException(`brand with id ${createProductDto.brandId} not found`);
    
    const subCategory = await this.subCategoryRepository.findOne({ where: { id: createProductDto.subCategoryId } });
    if (!subCategory) throw new NotFoundException(`subCategory with id ${createProductDto.subCategoryId} not found`);

    const product = this.productRepository.create({
      ...createProductDto,
      brand,
      subCategory,
      imageCover: files?.imageCover?.[0]?.filename ?? undefined,
      images: files?.images?.map(f => f.filename) ?? []
    });
    await this.productRepository.save(product);

    return {
      status: 'success',
      message: 'product created successfully',
      data: product
    }
  }

  public async findAll(page: number = 1, limit: number = 10) {
    const products = await this.productRepository.find({ 
      skip: (page - 1) * limit,
      take: limit,
      relations: ['brand', 'subCategory', 'subCategory.category', 'reviews'] 
    });
    return {
      status: 'success',
      message: 'products retrieved successfully',
      total: products.length,
      data: products
    }
  }

  public async findOne(id: number) {
    const product = await this.productRepository.findOne({ 
      where: { id }, 
      relations: ['brand', 'subCategory', 'subCategory.category', 'reviews'] 
    });
    if (!product) throw new NotFoundException(`product with id ${id} not found`);
    return {
      status: 'success',
      message: 'product retrieved successfully',
      data: product
    }
  }

  public async update(id: number, updateProductDto: UpdateProductDto, files: { imageCover?: Express.Multer.File[]; images?: Express.Multer.File[] } ) {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['brand', 'subCategory', 'subCategory.category'] });
    if (!product) throw new NotFoundException('product not found');

    if (files?.imageCover?.length && product.imageCover) {
      const imagePath = join(process.cwd(), `./images/products/${product.imageCover}`);
      if (existsSync(imagePath)) {
        unlinkSync(imagePath);
      }
    }

    if (files?.images?.length && product.images.length) {
      for (const image of product.images) {
        const imagePath = join(process.cwd(), `./images/products/${image}`);
        if (existsSync(imagePath)) {
          unlinkSync(imagePath);
        }
      }
    }

    if (files?.imageCover?.length) {
      product.imageCover = files.imageCover[0].filename;
    }

    if (files?.images?.length) {
      product.images = files.images.map(f => f.filename);
    }

    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.quantity = updateProductDto.quantity ?? product.quantity;
    product.price = updateProductDto.price ?? product.price;
    product.priceAfterDiscount = updateProductDto.priceAfterDiscount ?? product.priceAfterDiscount;
    product.isActive = updateProductDto.isActive ?? product.isActive;
    product.ratingAverage = updateProductDto.ratingAverage ?? product.ratingAverage;
    product.ratingQuantity = updateProductDto.ratingQuantity ?? product.ratingQuantity;
    product.sold = updateProductDto.sold ?? product.sold;
    product.colors = updateProductDto.colors ?? product.colors;

    if (updateProductDto.brandId) {
      const brand = await this.brandRepository.findOne({ where: { id: updateProductDto.brandId } });
      if (!brand) throw new NotFoundException('brand not found');
      product.brand = brand;
    }
    if (updateProductDto.subCategoryId) {
      const subCategory = await this.subCategoryRepository.findOne({ where: { id: updateProductDto.subCategoryId } });
      if (!subCategory) throw new NotFoundException('subCategory not found');
      product.subCategory = subCategory;
    }

    await this.productRepository.save(product);

    return {
      status: 'success',
      message: 'product updated successfully',
      data: product
    }
  }

  public async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`product with id ${id} not found`);

    await this.productRepository.remove(product);

    return {
      status: 'success',
      message: 'product deleted successfully',
      data: null
    }
  }

  public async findAllReviewsByProductId(productId: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    
    const reviews = await this.reviewRepository.find({ 
      where: { product: { id: productId } },
      relations: ['user']
    })

    return {
      status: 'success',
      message: `Reviews for product ${productId}`,
      total: reviews.length,
      data: reviews
    }
  }
}
