import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAddressessDto } from './dto/create-addressess.dto';
import { UpdateAddressessDto } from './dto/update-addressess.dto';

import { Addressess } from './entities/addressess.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AddressessService {
  constructor(
    @InjectRepository(Addressess) private readonly addressessRepository: Repository<Addressess>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  public async create(createAddressessDto: CreateAddressessDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (createAddressessDto.isDefault) {
      await this.addressessRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false }
      )
    }
    
    const address = this.addressessRepository.create({
      ...createAddressessDto,
      user
    })

    await this.addressessRepository.save(address);

    return {
      status: 'success',
      message: 'Address created successfully',
      data: address
    };
  }

  public async findAll(userId: number) {
    const addressess = await this.addressessRepository.find({
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
    const address = await this.addressessRepository.findOne({ 
      where: { 
        id,
        user: { id: userId }
      } 
    })
    
    if (!address) throw new NotFoundException('Address not found');

    if (updateAddressessDto.isDefault) {
      await this.addressessRepository.update(
        { user: { id: userId }, isDefault: true },
        { isDefault: false }
      )
    }

    Object.assign(address, updateAddressessDto);
    await this.addressessRepository.save(address);

    return {
      status: 'success',
      message: 'Address updated successfully',
      data: address
    };
  }

  public async remove(id: number, userId: number) {
    const address = await this.addressessRepository.findOne({ 
      where: { 
        id,
        user: { id: userId }
      } 
    })
    
    if (!address) throw new NotFoundException('Address not found');

    await this.addressessRepository.remove(address);

    return {
      status: 'success',
      message: 'Address deleted successfully',
      data: null
    };
  }
}
