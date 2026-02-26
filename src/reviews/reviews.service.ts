import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ) {}
  
  public async create(createReviewDto: CreateReviewDto) {
    // 1) check if user exists
    const user = await this.userRepository.findOne({ where: { id: createReviewDto.userId } });
    if (!user) throw new NotFoundException('User not found');

    // 2) check if product exists
    const product = await this.productRepository.findOne({ where: { id: createReviewDto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user: createReviewDto.userId as any,
      product: createReviewDto.productId as any
    });
    await this.reviewRepository.save(review);

    // 3) update product ratingQuantity && ratingAverage
    const oldQuantity = product.ratingQuantity;
    const oldAverage = product.ratingAverage;

    const newQuantity = oldQuantity + 1;
    const newAverage = ((oldAverage * oldQuantity) + createReviewDto.rating) / newQuantity;

    product.ratingQuantity = newQuantity;
    product.ratingAverage = newAverage;

    await this.productRepository.save(product);

    return {
      status: 'success',
      message: 'review created successfully',
      data: review
    }
  }

  public async findAll(page: number = 1, limit: number = 10) {
    const reviews = await this.reviewRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user']
    });
    return {
      status: 'success',
      message: 'reviews retrieved successfully',
      total: reviews.length,
      data: reviews
    }
  }

  public async findOne(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: ['user'] });
    if (!review) throw new NotFoundException('Review not found');
    return {
      status: 'success',
      message: 'review retrieved successfully',
      data: review
    }
  }

  public async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: ['product'] });
    if (!review) throw new NotFoundException('Review not found');
    
    const oldProduct = review.product;
    if (updateReviewDto.productId && updateReviewDto.productId !== oldProduct.id) {
      const newProduct = await this.productRepository.findOne({ where: { id: updateReviewDto.productId } });
      if (!newProduct) throw new NotFoundException('Product not found');

      // update old review for old product
      const oldQty = oldProduct.ratingQuantity;
      const oldAvg = oldProduct.ratingAverage;
      const newOldQty = oldQty - 1;

      oldProduct.ratingQuantity = newOldQty;
      oldProduct.ratingAverage = newOldQty === 0 ? 0 : ((oldAvg * oldQty) - review.rating) / newOldQty;

      // update new review for new product
      const newQty = newProduct.ratingQuantity;
      const newAvg = newProduct.ratingAverage;
      const newRating = updateReviewDto.rating ?? review.rating;
      const newNewQty = newQty + 1;

      newProduct.ratingQuantity = newNewQty;
      newProduct.ratingAverage = ((newAvg * newQty) + newRating) / newNewQty;

      review.product = newProduct;
      await this.productRepository.save([oldProduct, newProduct]);
    } else if (updateReviewDto.rating) {
      // update rating but product not change
      const qty = oldProduct.ratingQuantity;
      const avg = oldProduct.ratingAverage;
      const newAverage = ((avg * qty) - review.rating + updateReviewDto.rating) / qty;
      oldProduct.ratingAverage = newAverage;
      await this.productRepository.save(oldProduct);
    }

    if (updateReviewDto.userId) {
      const user = await this.userRepository.findOne({ where: { id: updateReviewDto.userId } });
      if (!user) throw new NotFoundException('User not found');
      review.user = user;
    }

    review.title = updateReviewDto.title ?? review.title;
    review.rating = updateReviewDto.rating ?? review.rating;

    await this.reviewRepository.save(review);

    return {
      status: 'success',
      message: 'review updated successfully',
      data: review
    }
  }

  public async remove(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: ['product'] });
    if (!review) throw new NotFoundException('Review not found');

    const product = review.product;
    
    const oldQuantity = product.ratingQuantity;
    const oldAverage = product.ratingAverage;

    const newQuantity = oldQuantity - 1;

    if (newQuantity === 0) {
      product.ratingAverage = 0;
      product.ratingQuantity = 0;
    } else {
      const newAverage = ((oldAverage * oldQuantity) - review.rating) / newQuantity;
      product.ratingQuantity = newQuantity;
      product.ratingAverage = newAverage;
    }
    
    await this.productRepository.save(product);
    await this.reviewRepository.remove(review);

    return {
      status: 'success',
      message: 'review deleted successfully',
      data: null
    }
  }
}
