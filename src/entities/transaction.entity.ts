import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  manager_id: number;

  @Column({ nullable: true })
  subscriber_id: number;

  @Column({ type: 'real', default: 0 })
  amount: number;

  @Column({ default: 'UGX' })
  currency: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  processed_at: Date;
}
