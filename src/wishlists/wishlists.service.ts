import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ) {}

  public async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const { productId } = createWishlistDto;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const wishlist = this.wishlistRepository.create({
      user: { id: userId },
      product: { id: productId }
    })

    try {
      await this.wishlistRepository.save(wishlist);
      return {
        status: 'success',
        message: 'Product added to wishlist',
        data: {
          id: wishlist.id,
          user: wishlist.user.id,
          product: wishlist.product.id,
          createdAt: wishlist.createdAt,
          updatedAt: wishlist.updatedAt,
        }
      }
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Product already in wishlist');
      }
    }
  }
  
  public async remove(productId: number, userId: number) {
    const wishlist = await this.wishlistRepository.findOne({ 
      where: { 
        product: { id: productId },
        user: { id: userId }
      },
      relations: ['user', 'product']
    })

    if (!wishlist) throw new NotFoundException('Product not found in wishlist');

    await this.wishlistRepository.remove(wishlist);

    return {
      status: 'success',
      message: 'Product removed from wishlist',
      data: null
    };
  }

  public async find(page: number = 1, limit: number = 10) {
    const wishlists = await this.wishlistRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['product']
    })
    return {
      status: 'success',
      message: 'wishlists retrieved successfully',
      total: wishlists.length,
      data: wishlists
    }
  }
}
