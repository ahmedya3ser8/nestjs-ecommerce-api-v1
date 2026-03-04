import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from 'src/carts/entities/cart.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from 'src/carts/entities/cart-item.entity';

import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentOrderStatusDto } from './dto/update-payment-status.dto';
import { OrderStatusType, PaymentMethodType, PaymentStatusType } from 'src/utils/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>
  ) {}

  public async createCashOrder(userId: number) {
    // check if user exists
    const user  = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addressess']
    })
    if (!user) throw new NotFoundException('User not found');

    // get default user address
    const shippingAddress = user.addressess.find(address => address.isDefault);
    if (!shippingAddress) throw new NotFoundException('No default shipping address found');

    // check if cart not found 
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems.product']
    })
    if (!cart || !cart.cartItems.length) throw new NotFoundException('Cart is empty');

    // calculate total order price
    const taxPrice = 0;
    const shippingPrice = 0;
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // create order
    const order = this.orderRepository.create({
      user,
      shippingAddress,
      taxPrice,
      shippingPrice,
      totalOrderPrice,
      paymentMethodType: PaymentMethodType.CASH,
      orderStatus: OrderStatusType.PROCESSING,
      paymentStatus: PaymentStatusType.PENDING
    })
    await this.orderRepository.save(order);

    // create orderItems
    const orderItems = cart.cartItems.map(item => this.orderItemRepository.create({ 
      order, 
      product: item.product, 
      price: item.price, 
      quantity: item.quantity 
    }))
    await this.orderItemRepository.save(orderItems);

    // update orderItems
    order.orderItems = orderItems;

    // clear user cart
    await this.cartItemRepository.remove(cart.cartItems);

    return {
      status: 'success',
      message: 'Order created successfully',
      data: order
    }
  }

  public async getLoggedUserOrders(userId: number) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'user']
    })

    return {
      status: 'success',
      message: 'Orders retrieved successfully',
      total: orders.length,
      data: orders
    }
  }

  public async getAllOrders() {
    const orders = await this.orderRepository.find({
      relations: ['orderItems', 'user']
    })
    return {
      status: 'success',
      message: 'Orders retrieved successfully',
      total: orders.length,
      data: orders
    }
  }

  public async updateOrderStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { orderStatus } = updateOrderStatusDto;

    const order = await this.orderRepository.findOne({ 
      where: { id },
      relations: ['orderItems', 'user']
    });

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    order.orderStatus = orderStatus;

    if (orderStatus === OrderStatusType.DELIVERED) {
      order.paidAt = new Date();
    } else {
      order.paidAt = null;
    }

    await this.orderRepository.save(order);

    return {
      status: 'success',
      message: 'Order status updated',
      data: order
    };
  }

  public async updatePaymentStatus(id: number, updatePaymentOrderStatusDto: UpdatePaymentOrderStatusDto) {
    const { paymentStatus } = updatePaymentOrderStatusDto;

    const order = await this.orderRepository.findOne({ 
      where: { id },
      relations: ['orderItems', 'user']
    });

    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    order.paymentStatus = paymentStatus;

    if (paymentStatus === PaymentStatusType.PAID) {
      order.paidAt = new Date();
    } else {
      order.paidAt = null;
    }

    await this.orderRepository.save(order);

    return {
      status: 'success',
      message: 'Payment status updated',
      data: order
    };
  }
}
