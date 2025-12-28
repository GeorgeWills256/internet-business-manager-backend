import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Manager } from './manager.entity';

@Entity()
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'int', default: 1 })
  daysGranted: number;

  @Column({ default: false })
  isFree: boolean;

  @Column({ default: false })
  used: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Manager, { nullable: false })
  manager: Manager;
}