import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './abstraction/base';
import { User } from './userEntity';

@Entity('job_descriptions')
export class JobDescription extends BaseEntity {
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'text', nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: true })
  company_name!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;
}
