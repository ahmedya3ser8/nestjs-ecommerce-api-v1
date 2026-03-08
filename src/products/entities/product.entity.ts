import { 
  BeforeInsert, 
  BeforeUpdate, 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import slugify from "slugify";

import { Brand } from "../../brands/entities/brand.entity";
import { SubCategory } from "../../sub-categories/entities/sub-category.entity";
import { Review } from "../../reviews/entities/review.entity";
import { Wishlist } from "../../wishlists/entities/wishlist.entity";
import { CartItem } from "../../carts/entities/cart-item.entity";
import { OrderItem } from "../../orders/entities/order-item.entity";
import type { ImageType } from "../../utils/types";

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  sold: number;

  @Column({ scale: 2 })
  price: number;

  @Column({ scale: 2, nullable: true })
  priceAfterDiscount: number;

  @Column({ type: 'text', array: true, default: [] })
  colors: string[];

  @Column({ type: 'json' })
  imageCover: ImageType;

  @Column({ type: 'json', default: [] })
  images: ImageType[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'float', default: 0 })
  ratingAverage: number;

  @Column({ type: 'int', default: 0 })
  ratingQuantity: number;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  subCategory: SubCategory;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[];
  
  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
  
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
}
