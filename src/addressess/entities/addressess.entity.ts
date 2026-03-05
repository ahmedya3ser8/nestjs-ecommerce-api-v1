import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "../../users/entities/user.entity";

@Entity({ name: 'addressess' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: true })
  phone: string;

  @Column()
  city: string;

  @Column()
  postalcode: string;

  @Column()
  street: string;
  
  @Column({ nullable: true })
  state: string;

  @Column()
  country: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.addressess, { onDelete: 'CASCADE' })
  user: User;
}
