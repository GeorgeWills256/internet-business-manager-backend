import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum PaymentIntentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity()
export class PaymentIntent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * =========================
   * BUSINESS CONTEXT
   * =========================
   */

  @Index()
  @Column()
  managerId: number;

  @Index()
  @Column()
  portalSessionId: string;

  /**
   * =========================
   * PAYMENT DETAILS
   * =========================
   */

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'integer' })
  days: number;

  @Column()
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: PaymentIntentStatus,
    default: PaymentIntentStatus.PENDING,
  })
  status: PaymentIntentStatus;

  /**
   * =========================
   * MOBILE MONEY REFERENCES
   * =========================
   */

  @Column({ nullable: true })
  providerTransactionId?: string;

  @Column({ nullable: true })
  provider?: string; // MTN / Airtel / AT

  /**
   * =========================
   * TIMESTAMPS
   * =========================
   */

  @CreateDateColumn()
  createdAt: Date;
}
