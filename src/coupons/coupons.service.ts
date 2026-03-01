import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(@InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>) {}

  public async create(createCouponDto: CreateCouponDto) {
    const couponExist = await this.couponRepository.findOne({ where: { code: createCouponDto.code.toLowerCase() } });
    if (couponExist) throw new BadRequestException('Coupon code already exists');
    
    const coupon = this.couponRepository.create({
      ...createCouponDto,
      code: createCouponDto.code.toLowerCase()
    });

    await this.couponRepository.save(coupon);

    return {
      status: 'success',
      message: 'coupon created successfully',
      data: coupon
    }
  }

  public async findAll() {
    const coupons = await this.couponRepository.find();
    return {
      status: 'success',
      message: 'Coupons retrieved successfully',
      total: coupons.length,
      data: coupons
    }
  }

  public async findOne(id: number) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    return {
      status: 'success',
      message: 'coupon retrieved successfully',
      data: coupon
    }
  }

  public async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    if (updateCouponDto.code) {
      const couponExist = await this.couponRepository.findOne({ 
        where: { code: updateCouponDto.code?.toLowerCase() } 
      });
      if (couponExist && couponExist.id !== id) throw new BadRequestException('Coupon code already exists');
      coupon.code = updateCouponDto.code?.toLowerCase();
    }

    coupon.expiresAt = updateCouponDto.expiresAt ?? coupon.expiresAt;
    coupon.discountType = updateCouponDto.discountType ?? coupon.discountType;
    coupon.discountValue = updateCouponDto.discountValue ?? coupon.discountValue;
    coupon.usageLimit = updateCouponDto.usageLimit ?? coupon.usageLimit;
    coupon.isActive = updateCouponDto.isActive ?? coupon.isActive;

    await this.couponRepository.save(coupon);

    return {
      status: 'success',
      message: 'coupon updated successfully',
      data: coupon
    }
  }

  public async remove(id: number) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    
    await this.couponRepository.remove(coupon);

    return {
      status: 'success',
      message: 'coupon deleted successfully',
      data: null
    }
  }
}
