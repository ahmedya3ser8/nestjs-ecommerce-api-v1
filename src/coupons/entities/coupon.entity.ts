import { DiscountType } from "src/utils/enums";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'coupons' })
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;
  
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'enum', enum: DiscountType, default: DiscountType.PERCENTAGE })
  discountType: DiscountType

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ default: 0 })
  usageLimit: number;

  @Column({ default: 0 })
  usedCount: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;
}
