import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('forgotPassword')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('verifyResetCode')
  @HttpCode(HttpStatus.OK)
  verifyResetCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyResetCode(verifyCodeDto);
  }

  @Patch('resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.resetPassword(resetPasswordDto, res);
  }
}
