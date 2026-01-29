import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SystemRevenue {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Which manager generated this revenue
   */
  @Column()
  managerId: number;

  /**
   * Subscriber payment reference
   */
  @Column({ nullable: true })
  paymentReference?: string;

  /**
   * System Support Fee collected (UGX)
   */
  @Column({ type: 'integer' })
  amount: number;

  /**
   * Tier at time of payment
   */
  @Column({ type: 'varchar', length: 20 })
  tier: string;

  @CreateDateColumn()
  createdAt: Date;
}
