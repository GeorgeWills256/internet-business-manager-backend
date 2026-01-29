import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class MobileMoneyTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Africa’s Talking transaction ID
   */
  @Index({ unique: true })
  @Column()
  transactionId: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'integer' })
  amount: number;

  @Column()
  currency: string;

  @Column()
  provider: string; // MTN, Airtel

  @Column()
  status: string; // Success, Failed

  /**
   * Link to portal session
   */
  @Column({ nullable: true })
  portalSessionId?: string;

  /**
   * Raw payload for audits
   */
  @Column({ type: 'jsonb' })
  rawPayload: any;

  @CreateDateColumn()
  createdAt: Date;
}
