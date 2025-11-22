import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  phone_mtn: string;

  @Column({ nullable: true })
  phone_airtel: string;

  @CreateDateColumn()
  created_at: Date;
}
