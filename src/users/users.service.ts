import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from 'src/utils/types';
import { UserRole } from 'src/utils/enums';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async create(createUserDto: CreateUserDto) {
    const emailExist = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (emailExist) throw new BadRequestException('Email already exist');

    const phoneExist = await this.userRepository.findOne({ where: { phone: createUserDto.phone } });
    if (phoneExist) throw new BadRequestException('Phone number already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
    await this.userRepository.save(newUser);

    return {
      status: 'success',
      message: 'user created successfully',
      data: newUser
    }
  }

  public async findAll() {
    const users = await this.userRepository.find();
    return {
      status: 'success',
      message: 'users retrieved successfully',
      total: users.length,
      data: users
    }
  }

  public async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return {
      status: 'success',
      message: 'user retrieved successfully',
      data: user
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto, payload?: JwtPayload) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExist = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
      if (emailExist) throw new BadRequestException('Email already exist');
    }

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const phoneExist = await this.userRepository.findOne({ where: { phone: updateUserDto.phone } });
      if (phoneExist) throw new BadRequestException('Phone number already exists');
    }

    if (payload?.role === UserRole.ADMIN) {
      user.role = updateUserDto.role ?? user.role;
      user.isActive = updateUserDto.isActive ?? user.isActive;
    }

    user.fullName = updateUserDto.fullName ?? user.fullName;
    user.email = updateUserDto.email ?? user.email;
    user.phone = updateUserDto.phone ?? user.phone;

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    await this.userRepository.save(user);

    return {
      status: 'success',
      message: 'user updated successfully',
      data: user
    }
  }

  public async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');

    await this.userRepository.remove(user);

    return {
      status: 'success',
      message: 'user deleted successfully',
      data: null
    }
  }
}
