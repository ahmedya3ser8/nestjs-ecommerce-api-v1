import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomInt, createHash } from 'crypto';
import * as bcrypt from 'bcryptjs';

import { RegisterDto } from 'src/auth/dto/register.dto'; 
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from 'src/utils/types';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  public async register(registerDto: RegisterDto) {
    const { fullName, email, password, phone, confirmPassword } = registerDto;
    
    const emailExist = await this.userRepository.findOne({ where: { email } });
    if (emailExist) throw new BadRequestException('User already exist');

    const phoneExist = await this.userRepository.findOne({ where: { phone } });
    if (phoneExist) throw new BadRequestException('Phone number already exists');

    if (password !== confirmPassword) throw new BadRequestException('Confirm password incorrect');
    
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
      message: 'User registerd successfully',
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
      message: 'User login successfully',
      data: user,
      token
    }
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // 1) check if user exists
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    
    // 2) if user exists generate 6 digits and hashed it
    const resetCode = randomInt(100000, 1000000).toString();
    const hashedResetCode = createHash('sha256').update(resetCode).digest('hex');

    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

    await this.userRepository.save(user);

    // 3) send code via email
    try {
      await this.mailService.sendResetCode(email, resetCode, user.fullName);
    } catch (error) {
      user.passwordResetCode = null;
      user.passwordResetExpires = null;
      user.passwordResetVerified = false;
      await this.userRepository.save(user);
      throw new InternalServerErrorException('There was an error sending the email. Try again later!');
    }

    return {
      status: 'success',
      message: 'Reset code sent to email'
    };
  }

  public async verifyResetCode(verifyCodeDto: VerifyCodeDto) {
    const { resetCode } = verifyCodeDto;
    
    const hashedResetCode = createHash('sha256').update(resetCode).digest('hex');
    
    const user = await this.userRepository.findOne({ 
      where: { 
        passwordResetCode: hashedResetCode, 
        passwordResetExpires: MoreThan(new Date()) 
      } 
    })
    
    if (!user) throw new BadRequestException('Invalid or expired reset code');
    
    user.passwordResetVerified = true;
    user.passwordResetCode = null;
    user.passwordResetExpires = null;

    await this.userRepository.save(user);

    return {
      status: 'success',
      message: 'Reset code verified successfully'
    }
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword, confirmNewPassword } = resetPasswordDto;
    
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.passwordResetVerified) throw new BadRequestException('Reset code not verified');

    if (newPassword !== confirmNewPassword) throw new BadRequestException('Confirm new password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordChangedAt = new Date(); 

    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    user.passwordResetVerified = false;

    await this.userRepository.save(user);

    const token = await this.generateJwt({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    })

    return {
      status: 'success',
      message: 'Password reset successfully',
      data: user,
      token
    }
  }

  private generateJwt(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
}
