import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column({ nullable: true })
  actorId?: number; // managerId, adminId, etc.

  @Column('json', { nullable: true })
  details?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}