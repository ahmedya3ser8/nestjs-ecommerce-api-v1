import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAddressessDto } from './dto/create-addressess.dto';
import { UpdateAddressessDto } from './dto/update-addressess.dto';

import { Address } from './entities/addressess.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AddressessService {
  constructor(
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async create(createAddressessDto: CreateAddressessDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (createAddressessDto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false }
      )
    }
    
    const address = this.addressRepository.create({
      ...createAddressessDto,
      user
    })

    await this.addressRepository.save(address);

    return {
      status: 'success',
      message: 'Address created successfully',
      data: address
    };
  }

  public async findAll(userId: number) {
    const addressess = await this.addressRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user']
    })

    return {
      status: 'success',
      message: 'Addressess retrieved successfully',
      total: addressess.length,
      data: addressess
    }
  }

  public async update(id: number, updateAddressessDto: UpdateAddressessDto, userId: number) {
    const address = await this.addressRepository.findOne({ 
      where: { 
        id,
        user: { id: userId }
      } 
    })
    
    if (!address) throw new NotFoundException('Address not found');

    if (updateAddressessDto.isDefault) {
      await this.addressRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false }
      )
    }

    Object.assign(address, updateAddressessDto);
    await this.addressRepository.save(address);

    return {
      status: 'success',
      message: 'Address updated successfully',
      data: address
    };
  }

  public async remove(id: number, userId: number) {
    const address = await this.addressRepository.findOne({ 
      where: { 
        id,
        user: { id: userId }
      } 
    })
    
    if (!address) throw new NotFoundException('Address not found');

    await this.addressRepository.remove(address);

    return {
      status: 'success',
      message: 'Address deleted successfully',
      data: null
    };
  }
}
