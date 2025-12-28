import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ServiceFeeSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  managerId?: number;

  @Column({ type: 'integer' })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
