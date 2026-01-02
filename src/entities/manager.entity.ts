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
   * =========================
   * AUTH & IDENTITY
   * =========================
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
   * =========================
   * ROLES / PERMISSIONS
   * =========================
   */

  /**
   * System-level admin (YOU / platform owner)
   * - Can view metrics
   * - Can suspend managers
   * - Can audit system
   */
  @Column({ default: false })
  isAdmin: boolean;

  /**
   * Business manager (router owner)
   */
  @Column({ default: true })
  isManager: boolean;

  /**
   * Manager can also act as salesperson
   */
  @Column({ default: true })
  canActAsSalesperson: boolean;

  /**
   * =========================
   * ABUSE / ENFORCEMENT FLAGS
   * =========================
   */

  /**
   * Hard suspension (admin-enforced)
   */
  @Column({ default: false })
  isSuspended: boolean;

  /**
   * Optional suspension expiry
   */
  @Column({ type: 'timestamptz', nullable: true })
  suspendedUntil?: Date;

  /**
   * Reason shown to manager
   */
  @Column({ type: 'text', nullable: true })
  suspensionReason?: string;

  /**
   * =========================
   * BUSINESS CONFIG
   * =========================
   */

  @Column({ type: 'int', default: 5 })
  dailyFreeCodesLimit: number;

  @Column({ type: 'integer', default: 1000 })
  dailyInternetFee: number;

  /**
   * =========================
   * FINANCIAL TRACKING
   * =========================
   */

  @Column({ type: 'integer', default: 0 })
  balance: number;

  /**
   * Weekly platform fee owed to admin
   */
  @Column({ type: 'integer', default: 0 })
  pendingWeeklyFee: number;

  /**
   * Grace period before blocking services
   */
  @Column({ type: 'timestamptz', nullable: true })
  pendingGraceExpiry?: Date;

  /**
   * =========================
   * FREE CODE TRACKING
   * (RESETS DAILY)
   * =========================
   */

  @Column({ type: 'integer', default: 0 })
  freeCodesIssuedToday: number;

  @Column({ type: 'date', nullable: true })
  freeCodesIssuedDate?: string;

  /**
   * =========================
   * RELATIONS
   * =========================
   */

  @OneToMany(() => Subscriber, (s) => s.manager)
  subscribers: Subscriber[];

  @OneToMany(() => Code, (c) => c.manager)
  codes: Code[];
}