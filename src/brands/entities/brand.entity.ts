import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import slugify from 'slugify';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  
  @Column({ unique: true })
  slug: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
  }
}
