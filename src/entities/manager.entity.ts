import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ nullable: true })
  installation_code: string;

  @Column({ nullable: true })
  mobile_provider: string;

  @CreateDateColumn()
  created_at: Date;
}
