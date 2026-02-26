import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import slugify from "slugify";

import { Brand } from "src/brands/entities/brand.entity";
import { SubCategory } from "src/sub-categories/entities/sub-category.entity";
import { Expose, Transform } from "class-transformer";
import { Review } from "src/reviews/entities/review.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";

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

  @Expose()
  @Transform(({ value }) => value ? `${process.env.BASE_URL}/images/products/${value}` : null)
  @Column()
  imageCover: string;

  @Expose()
  @Transform(({ value }) => value?.map((img: any) => `${process.env.BASE_URL}/images/products/${img}`))
  @Column({ type: 'text', array: true, default: [] })
  images: string[];

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

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
}
