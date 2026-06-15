import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './abstraction/base';
import { Resume } from './resumeEntity';

@Entity('ats_reports')
export class AtsReport extends BaseEntity {
  @ManyToOne(() => Resume, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume!: Resume;

  @Column({ type: 'float', nullable: false })
  match_percentage!: number;

  @Column({ type: 'json', nullable: true })
  strengths!: string[];

  @Column({ type: 'json', nullable: true })
  missing_skills!: string[];

  @Column({ type: 'json', nullable: false })
  recommendations!: string[];

  @Column({ type: 'text', nullable: false })
  summary!: string;
}
