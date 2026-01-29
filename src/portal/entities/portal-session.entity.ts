import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Subscriber } from '../../entities/subscriber.entity';

export enum PortalSessionStatus {
  CREATED = 'CREATED',                 // router detected client
  PAYMENT_PENDING = 'PAYMENT_PENDING', // user viewing portal
  PAID = 'PAID',                       // payment confirmed
  ACCESS_GRANTED = 'ACCESS_GRANTED',   // router opened internet
  EXPIRED = 'EXPIRED',                 // session expired
}

@Entity()
export class PortalSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * =========================
   * IDENTIFICATION (FROM ROUTER)
   * =========================
   */

  @Index()
  @Column()
  managerId: number;

  @Index()
  @Column()
  macAddress: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  routerId?: string;

  /**
   * =========================
   * SESSION STATE
   * =========================
   */

  @Column({
    type: 'enum',
    enum: PortalSessionStatus,
    default: PortalSessionStatus.CREATED,
  })
  status: PortalSessionStatus;

  /**
   * =========================
   * SUBSCRIBER (SET AFTER PAYMENT)
   * =========================
   */

  @ManyToOne(() => Subscriber, { nullable: true })
  subscriber?: Subscriber;

  /**
   * =========================
   * PAYMENT TRACKING
   * =========================
   */

  @Column({ nullable: true })
  paymentReference?: string;

  @Column({ type: 'integer', nullable: true })
  amountPaid?: number;

  @Column({ type: 'integer', nullable: true })
  daysGranted?: number;

  /**
   * =========================
   * LIFETIME CONTROL
   * =========================
   */

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;
}