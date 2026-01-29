import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class SystemRevenue {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Manager that generated this revenue
   */
  @Index()
  @Column()
  managerId: number;

  /**
   * Amount earned by IBM (System Support Fee)
   */
  @Column({ type: 'integer' })
  amount: number;

  /**
   * Manager tier at time of payment
   */
  @Column({ type: 'varchar', length: 20 })
  tier: string;

  /**
   * Reference from payment provider / mock
   */
  @Column({ type: 'varchar', length: 120, nullable: true })
  paymentReference?: string;

  /**
   * Timestamp
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
