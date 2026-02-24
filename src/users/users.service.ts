import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

import { User } from './entities/user.entity';
import { JwtPayload } from 'src/utils/types';
import { UserRole } from 'src/utils/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  public async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const emailExist = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (emailExist) throw new BadRequestException('Email already exist');

    const phoneExist = await this.userRepository.findOne({ where: { phone: createUserDto.phone } });
    if (phoneExist) throw new BadRequestException('Phone number already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      profileImage: file?.filename ?? null
    });
    await this.userRepository.save(newUser);

    return {
      status: 'success',
      message: 'user created successfully',
      data: newUser
    }
  }

  public async findAll(page: number = 1, limit: number = 10) {
    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
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

  public async update(id: number, updateUserDto: UpdateUserDto, payload?: JwtPayload, file?: Express.Multer.File) {
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

    if (file && user.profileImage) {
      const imagePath = join(process.cwd(), `./images/users/${user.profileImage}`);
      if (existsSync(imagePath)) unlinkSync(imagePath);
    }

    if (file) {
      user.profileImage = file?.filename;
    }

    user.fullName = updateUserDto.fullName ?? user.fullName;
    user.email = updateUserDto.email ?? user.email;
    user.phone = updateUserDto.phone ?? user.phone;

    await this.userRepository.save(user);

    return {
      status: 'success',
      message: 'user updated successfully',
      data: user
    }
  }

  public async updatePassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { currentPassword, newPassword, confirmNewPassword } = updateUserPasswordDto;
    
    // check if user exists
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');

    // check current password matched with user password
    const isMatchedPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isMatchedPassword) throw new BadRequestException('Current password is incorrect');

    // check if newPassword and confirmNewPassword matched
    if (newPassword !== confirmNewPassword) throw new BadRequestException('Confirm new password is incorrect');

    // hashed new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordChangedAt = new Date(); 

    await this.userRepository.save(user);

    const token = await this.generateJwt({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    })

    return {
      status: 'success',
      message: 'password updated successfully',
      data: user,
      token
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

  private generateJwt(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
}
