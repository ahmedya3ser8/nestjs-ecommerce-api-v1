import { DataSource, DataSourceOptions } from 'typeorm';

import { Address } from 'src/addressess/entities/addressess.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { CartItem } from 'src/carts/entities/cart-item.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { SubCategory } from 'src/sub-categories/entities/sub-category.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { config } from 'dotenv';

// dotenv config
config({ path: '.env' });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Category, SubCategory, Brand, Product, User, Review, Wishlist, Address, Coupon, Cart, CartItem, Order, OrderItem],
  migrations: ['dist/db/migrations/*.js']
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
