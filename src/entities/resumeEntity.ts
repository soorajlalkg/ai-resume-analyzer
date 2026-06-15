import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './abstraction/base';
import { User } from './userEntity';

@Entity('resumes')
export class Resume extends BaseEntity {
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'text', nullable: false })
  file_name!: string;

  @Column({ type: 'text', nullable: false })
  file_key!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  extracted_text!: string | null;
}
