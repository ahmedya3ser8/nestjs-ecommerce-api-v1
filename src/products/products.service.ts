import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Brand } from '../brands/entities/brand.entity';
import { Review } from '../reviews/entities/review.entity';
import { SubCategory } from '../sub-categories/entities/sub-category.entity';
import { Product } from './entities/product.entity';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageType } from '../utils/types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    @InjectRepository(SubCategory) private readonly subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  public async create(createProductDto: CreateProductDto, files: { imageCover?: Express.Multer.File[]; images?: Express.Multer.File[] } ) {
    const brand = await this.brandRepository.findOne({ where: { id: createProductDto.brandId } });
    if (!brand) throw new NotFoundException(`brand with id ${createProductDto.brandId} not found`);
    
    const subCategory = await this.subCategoryRepository.findOne({ where: { id: createProductDto.subCategoryId } });
    if (!subCategory) throw new NotFoundException(`subCategory with id ${createProductDto.subCategoryId} not found`);

    if (!files?.imageCover?.length) {
      throw new BadRequestException('imageCover is required');
    }

    let imageCover: ImageType = await this.cloudinaryService.uploadSingleImage(
      files.imageCover[0],
      'ecommerce/products'
    );

    let images: ImageType[] = [];

    if (files?.images?.length) {
      images = await this.cloudinaryService.uploadMultipleImages(
        files.images,
        'ecommerce/products'
      );
    }

    const product = this.productRepository.create({
      ...createProductDto,
      brand,
      subCategory,
      imageCover,
      images
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

    if (files?.imageCover?.length) {
      if (product.imageCover?.publicId) {
        await this.cloudinaryService.deleteSingleImage(product.imageCover.publicId);
      }
      product.imageCover = await this.cloudinaryService.uploadSingleImage(files.imageCover[0], 'ecommerce/products');
    }

    if (files?.images?.length) {
      if (product.images?.length) {
        for (const img of product.images) {
          if (img.publicId) await this.cloudinaryService.deleteSingleImage(img.publicId);
        }
      }
      product.images = await this.cloudinaryService.uploadMultipleImages(files.images, 'ecommerce/products');
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

    if (product.imageCover?.publicId) {
      await this.cloudinaryService.deleteSingleImage(product.imageCover.publicId);
    }

    if (product.images?.length) {
      for (const img of product.images) {
        if (img.publicId) {
          await this.cloudinaryService.deleteSingleImage(img.publicId);
        }
      }
    }

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
