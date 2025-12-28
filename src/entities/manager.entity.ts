import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Subscriber } from './subscriber.entity';
import { Code } from './code.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * AUTH & IDENTITY
   */

  @Index({ unique: true })
  @Column({ nullable: true })
  phone?: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  passwordHash?: string;

  /**
   * ROLES / PERMISSIONS
   */

  // System-level admin (you / superuser)
  @Column({ default: false })
  isAdmin: boolean;

  // Manager role (default true for this entity)
  @Column({ default: true })
  isManager: boolean;

  // Manager can also sell directly
  @Column({ default: true })
  canActAsSalesperson: boolean;

  /**
   * BUSINESS CONFIG
   */

  @Column({ type: 'int', default: 5 })
  dailyFreeCodesLimit: number;

  @Column({ type: 'integer', default: 1000 })
  dailyInternetFee: number;

  /**
   * FINANCIAL TRACKING
   */

  @Column({ type: 'integer', default: 0 })
  balance: number;

  @Column({ type: 'integer', default: 0 })
  pendingWeeklyFee: number;

  @Column({ type: 'timestamptz', nullable: true })
  pendingGraceExpiry?: Date;

  /**
   * FREE CODE TRACKING (RESETS DAILY)
   */

  @Column({ type: 'integer', default: 0 })
  freeCodesIssuedToday: number;

  @Column({ type: 'date', nullable: true })
  freeCodesIssuedDate?: string;

  /**
   * RELATIONS
   */

  @OneToMany(() => Subscriber, (s) => s.manager)
  subscribers: Subscriber[];

  @OneToMany(() => Code, (c) => c.manager)
  codes: Code[];
}