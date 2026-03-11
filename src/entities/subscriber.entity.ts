import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Manager } from './manager.entity';

@Entity()
@Index(['phone'])
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ default: false })
  active: boolean;

  @Column({ type: 'int', default: 0 })
  daysPurchased: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiryDate?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  /**
   * MANY SUBSCRIBERS → ONE MANAGER
   */
  @ManyToOne(() => Manager, (manager) => manager.subscribers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  manager: Manager;
}
