import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/user.decorator';

import { UserRole } from 'src/utils/enums';
import type { JwtPayload } from 'src/utils/types';

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
  
  @Delete('deleteMe')
  @UseGuards(AuthGuard)
  deleteLoggedUser(@CurrentUser() payload: JwtPayload) {
    return this.usersService.remove(payload.id);
  }
  
  // for admin only
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
