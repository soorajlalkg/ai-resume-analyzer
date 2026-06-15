import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './abstraction/base';
import { User } from './userEntity';

@Entity('user_verifications')
export class UserVerification extends BaseEntity {
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 6, nullable: false })
  otp!: string;

  @Column({ type: 'timestamp', nullable: false })
  expires_at!: Date;

  @Column({ type: 'boolean', default: false })
  is_verified!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verified_at!: Date;
}
