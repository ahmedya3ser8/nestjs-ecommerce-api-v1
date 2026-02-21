import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { RegisterDto } from 'src/auth/dto/register.dto'; 
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  public async register(registerDto: RegisterDto) {
    const { fullName, email, password, phone, confirmPassword } = registerDto;
    
    const emailExist = await this.userRepository.findOne({ where: { email } });
    if (emailExist) throw new BadRequestException('User already exist');

    const phoneExist = await this.userRepository.findOne({ where: { phone } });
    if (phoneExist) throw new BadRequestException('Phone number already exists');

    if (password !== confirmPassword) throw new BadRequestException('Confirm password incorrect')
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      fullName,
      email,
      phone,
      password: hashedPassword
    })

    await this.userRepository.save(newUser);

    return {
      status: 'success',
      message: 'user registerd successfully',
      data: newUser
    }
  }

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid email or password');
    
    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) throw new BadRequestException('Invalid email or password');

    const token = await this.generateJwt({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    })

    return {
      status: 'success',
      message: 'user login successfully',
      data: user,
      token
    }
  }

  private generateJwt(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
}
