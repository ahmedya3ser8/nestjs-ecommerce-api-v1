import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { Coupon } from '../coupons/entities/coupon.entity';

import { DiscountType } from '../utils/enums';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>
  ) {}

  public async create(createCartDto: CreateCartDto, userId: number) {
    const { productId } = createCartDto;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    let cart = await this.cartRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product']
    });
    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId }, cartItems: [], totalCartPrice: 0 });
    }

    const existItem = cart.cartItems.find(item => item.product.id === productId);

    if (existItem) {
      existItem.quantity += 1;
      existItem.price = product.price;
      await this.cartItemRepository.save(existItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        product,
        price: product.price,
        quantity: 1
      });
      await this.cartItemRepository.save(newItem);
      cart.cartItems.push(newItem);
    }

    cart.totalCartPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    cart.totalPriceAfterDiscount = null;

    await this.cartRepository.save(cart);

    return {
      status: 'success',
      message: 'Product added successfully to cart',
      numOfCartItems: cart.cartItems.length,
      data: cart
    }
  }

  public async find(userId: number) {
    let cart = await this.cartRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['cartItems.product']
    });
    
    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId }, cartItems: [], totalCartPrice: 0 });
      await this.cartRepository.save(cart);
    }

    return {
      status: 'success',
      message: 'Cart retrieved successfully',
      numOfCartItems: cart.cartItems.length,
      data: cart
    }
  }

  public async update(productId: number, updateCartDto: UpdateCartDto, userId: number) {
    const { quantity } = updateCartDto;

    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product'],
    });
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItem = cart.cartItems.find(item => item.product.id === productId);

    if (!cartItem) throw new NotFoundException('Product not found in cart');

    cartItem.quantity = quantity;
    cartItem.price = cartItem.product.price;

    await this.cartItemRepository.save(cartItem);

    cart.totalCartPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    cart.totalPriceAfterDiscount = null;

    await this.cartRepository.save(cart);

    return {
      status: 'success',
      message: 'Cart item quantity updated successfully',
      numOfCartItems: cart.cartItems.length,
      data: cart,
    };
  }

  public async remove(productId: number, userId: number) {
    const cart = await this.cartRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product']
    });

    if (!cart) throw new NotFoundException('Cart not found');

    const cartItem = cart.cartItems.find(item => item.product.id === productId);

    if (!cartItem) throw new NotFoundException('Product not found');

    await this.cartItemRepository.remove(cartItem);

    cart.cartItems = cart.cartItems.filter(item => item.product.id !== productId);

    cart.totalCartPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    cart.totalPriceAfterDiscount = null;

    await this.cartRepository.save(cart);

    return {
      status: 'success',
      message: 'Product removed successfully from cart',
      numOfCartItems: cart.cartItems.length,
      data: cart
    };
  }

  public async clearCart(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems'],
    });
    if (!cart) throw new NotFoundException('Cart not found');

    if (cart.cartItems.length > 0) {
      await this.cartItemRepository.remove(cart.cartItems);
    }

    cart.cartItems = [];
    cart.totalCartPrice = 0;
    cart.totalPriceAfterDiscount = null;

    await this.cartRepository.save(cart);

    return {
      status: 'success',
      message: 'Cart cleared successfully',
      data: cart,
    };
  }

  public async applyCoupon(validateCouponDto: ValidateCouponDto, userId: number) {
    const { code } = validateCouponDto;
    const coupon = await this.couponRepository.findOne({ 
      where: { code: code.toLowerCase(), isActive: true } 
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon');
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new BadRequestException('Coupon expired');
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    const cart = await this.cartRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['cartItems.product']
    });

    if (!cart) throw new NotFoundException('Cart not found');

    let discountAmount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (cart.totalCartPrice * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    const finalTotalPrice = cart.totalCartPrice - discountAmount;

    cart.totalPriceAfterDiscount = finalTotalPrice > 0 ? Number(finalTotalPrice.toFixed(2)) : 0;

    await this.cartRepository.save(cart);

    return {
      status: 'success',
      message: 'Coupon applied successfully',
      numOfCartItems: cart.cartItems.length,
      data: cart
    }
  }
}
