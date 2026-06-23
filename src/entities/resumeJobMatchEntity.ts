import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './abstraction/base';
import { Resume } from './resumeEntity';
import { JobDescription } from './jobDescriptionEntity';

@Entity('resume_job_matches')
export class ResumeJobMatch extends BaseEntity {
  @ManyToOne(() => JobDescription, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_description_id' })
  jobDescription!: JobDescription;

  @ManyToOne(() => Resume, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume!: Resume;

  @Column({ type: 'float', nullable: false })
  match_percentage!: number;

  @Column({ type: 'text', nullable: false })
  category!: string;

  @Column({ type: 'json', nullable: true })
  strengths!: string[];

  @Column({ type: 'json', nullable: true })
  missing_skills!: string[];

  @Column({ type: 'json', nullable: false })
  recommendations!: string[];

  @Column({ type: 'text', nullable: false })
  summary!: string;
}
