import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { BaseEntity } from './abstraction/base';
import { UserType } from '../common/enum/userTypeEnum';

@Entity('users')
export class User extends BaseEntity {
  @Column({type: 'text', nullable: false})
  name!: string;

  @Column({ unique: true, type: 'text', nullable: false })
  email!: string;

  @Column({type: 'text', nullable: false, select: false})
  password!: string;

  @Column({
      type: 'enum',
      enum: UserType,
      enumName: 'user_type_enum',
  })
  type!: UserType;

  @Column({ default: false, type: 'boolean' })
  is_email_verified!: boolean;

  @Column({ type: 'text', nullable: true })
  profile_url!: string;

   // Hash before insert
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Hash only if password changed
  @BeforeUpdate()
  async hashPasswordUpdate() {
    if (this.password) {
      const isHashed = this.password.startsWith('$2b$');
      if (!isHashed) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    }
  }
}
