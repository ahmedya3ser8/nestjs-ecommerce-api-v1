import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

import { AuthGuard } from 'src/users/guards/auth.guard'; 
import { RolesGuard } from 'src/users/guards/roles.guard'; 

import { Roles } from 'src/users/decorators/roles.decorator'; 
import { CurrentUser } from 'src/users/decorators/user.decorator';

import { UserRole } from 'src/utils/enums';
import type { JwtPayload } from 'src/utils/types';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // for logged user
  @Get('getMe')
  @UseGuards(AuthGuard)
  getLoggedUser(@CurrentUser() payload: JwtPayload) {
    return this.usersService.findOne(payload.id);
  }

  @Patch('updateMe')
  @UseGuards(AuthGuard)
  updateLoggedUser(@CurrentUser() payload: JwtPayload, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(payload.id, updateUserDto, payload);
  }

  @Patch('changeMyPassword')
  @UseGuards(AuthGuard)
  updateLoggedUserPassword(@CurrentUser() payload: JwtPayload, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return this.usersService.updatePassword(payload.id, updateUserPasswordDto);
  }
  
  @Delete('deleteMe')
  @UseGuards(AuthGuard)
  deactivateLoggedUser(@CurrentUser() payload: JwtPayload) {
    return this.usersService.deactivate(payload.id);
  }
  
  // for admin only
  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.create(createUserDto, file);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get(':userId/reviews')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllReviewsByProductId(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findAllReviewsByUserId(userId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImage'))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto, 
    @CurrentUser() payload: JwtPayload, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.update(id, updateUserDto, payload, file);
  }

  @Patch('changePassword/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updatePassword(@Param('id', ParseIntPipe) id: number, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    return this.usersService.updatePassword(id, updateUserPasswordDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivate(id);
  }
}
