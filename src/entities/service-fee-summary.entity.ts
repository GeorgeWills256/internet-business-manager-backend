import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ServiceFeeSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  manager_id: number;

  @Column()
  period_start: Date;

  @Column()
  period_end: Date;

  @Column({ type: 'real', default: 0 })
  total_subscriptions_amount: number;

  @Column({ type: 'real', default: 0 })
  admin_fee_amount: number;

  @Column({ default: false })
  is_settled: boolean;

  @Column({ nullable: true })
  settled_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
