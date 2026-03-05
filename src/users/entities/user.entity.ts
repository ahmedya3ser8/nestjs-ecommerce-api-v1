import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude, Expose, Transform } from "class-transformer";

import { UserRole } from "../../utils/enums";
import { Review } from "../../reviews/entities/review.entity";
import { Wishlist } from "../../wishlists/entities/wishlist.entity";
import { Address } from "../../addressess/entities/addressess.entity";
import { Cart } from "../../carts/entities/cart.entity";
import { Order } from "../../orders/entities/order.entity";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Expose()
  @Column({ nullable: true })
  @Transform(({ value }) => value ? `${process.env.BASE_URL}/images/users/${value}` : null)
  profileImage: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  passwordResetCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  passwordResetExpires: Date | null;
  
  @Column({ default: false })
  @Exclude()
  passwordResetVerified: boolean;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  @OneToMany(() => Address, (address) => address.user)
  addressess: Address[];
  
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
  
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
