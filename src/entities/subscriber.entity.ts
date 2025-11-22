import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  manager_id: number;

  @Column()
  phone: string;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ default: 0 })
  days_paid: number;

  @Column({ nullable: true })
  last_payment: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  activated_at: Date;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  code_duration_days: number;

  @Column({ nullable: true })
  code_expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
