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
   * BUSINESS IDENTITY
   * =========================
   */
  @Column({ type: 'varchar', length: 120 })
  businessName: string;

  /**
   * =========================
   * CAPTIVE PORTAL BRANDING
   * =========================
   */
  @Column({
    type: 'varchar',
    length: 255,
    default: 'Welcome! Please purchase internet access to continue.',
  })
  welcomeMessage: string;

  /**
   * =========================
   * PLATFORM TIER
   * =========================
   */
  @Column({
    type: 'varchar',
    length: 10,
    default: 'TIER_1',
  })
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';

  /**
   * =========================
   * MONTHLY SUBSCRIPTION (CANONICAL)
   * =========================
   *
   * Rule:
   * - NULL  → PAID
   * - SET   → PENDING
   */
  @Column({ type: 'timestamptz', nullable: true })
  subscriptionDueAt?: Date;

  /**
   * =========================
   * ROLES / PERMISSIONS
   * =========================
   */
  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true })
  isManager: boolean;

  @Column({ default: true })
  canActAsSalesperson: boolean;

  /**
   * =========================
   * ABUSE / MANUAL SUSPENSION
   * =========================
   */
  @Column({ default: false })
  isSuspended: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  suspendedUntil?: Date;

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
   * =========================
   * FREE CODE TRACKING
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
