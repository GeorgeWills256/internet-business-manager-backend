import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Manager } from './manager.entity';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  phone: string;

  @Column({ default: false })
  active: boolean;

  @Column({ type: 'int', default: 0 })
  daysPurchased: number;

  @Column({ type: 'timestamptz', nullable: true })
  expiryDate?: Date;

  /**
   * RELATION: MANY SUBSCRIBERS → ONE MANAGER
   */
  @ManyToOne(() => Manager, (manager) => manager.subscribers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  manager: Manager;
}
