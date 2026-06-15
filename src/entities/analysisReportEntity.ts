import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './abstraction/base';
import { JobDescription } from './jobDescriptionEntity';
import { Resume } from './resumeEntity';

@Entity('analysis_reports')
export class AnalysisReport extends BaseEntity {
  @ManyToOne(() => JobDescription, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_description_id' })
  jobDescription!: JobDescription;

  @ManyToOne(() => Resume, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume!: Resume;

  @Column({type: 'float', nullable: false})
  match_percentage!: number;

  @Column({type: 'json', nullable: true})
  strengths!: string[];

  @Column({type: 'json', nullable: true})
  missing_skills!: string[];

  @Column({ type: 'json', nullable: false })
  recommendations!: string[];

  @Column({ type: 'text', nullable: false })
  summary!: string;
}
