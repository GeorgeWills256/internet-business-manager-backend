import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  manager_id: number;

  @Column()
  duration_days: number;

  @Column({ nullable: true })
  assigned_to_subscriber_id: number;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  expires_at: Date;
}
