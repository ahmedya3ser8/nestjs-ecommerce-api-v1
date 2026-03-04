import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';

import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentOrderStatusDto } from './dto/update-payment-status.dto';
import { OrdersService } from './orders.service';

import { Roles } from 'src/users/decorators/roles.decorator';
import { CurrentUser } from 'src/users/decorators/user.decorator';

import { AuthGuard } from 'src/users/guards/auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';

import { UserRole } from 'src/utils/enums';
import type { JwtPayload } from 'src/utils/types';

@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  createCashOrder(@CurrentUser() payload: JwtPayload) {
    return this.ordersService.createCashOrder(payload.id);
  }

  @Get('getMe')
  @UseGuards(AuthGuard)
  getLoggedUserOrders(@CurrentUser() payload: JwtPayload) {
    return this.ordersService.getLoggedUserOrders(payload.id);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Patch(':id/paymentStatus')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updatePaymentStatus(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentOrderStatusDto: UpdatePaymentOrderStatusDto) {
    return this.ordersService.updatePaymentStatus(id, updatePaymentOrderStatusDto);
  }
}
