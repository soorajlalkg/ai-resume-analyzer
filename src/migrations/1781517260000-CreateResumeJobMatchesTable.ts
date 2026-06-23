import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResumeJobMatchesTable1781517260000 implements MigrationInterface {
  name = 'CreateResumeJobMatchesTable1781517260000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE resume_job_matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        resume_id UUID NOT NULL,
        job_id UUID NOT NULL,

        match_percentage FLOAT NOT NULL,
        category VARCHAR(50) NOT NULL,

        strengths JSON,
        missing_skills JSON,
        recommendations JSON,

        summary TEXT,

        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT fk_resume_job_matches_resume
          FOREIGN KEY (resume_id)
          REFERENCES resumes(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_resume_job_matches_job
          FOREIGN KEY (job_id)
          REFERENCES job_descriptions(id)
          ON DELETE CASCADE,

        CONSTRAINT uq_resume_job
          UNIQUE (resume_id, job_id)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_resume_job_matches_resume_id
      ON resume_job_matches(resume_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_resume_job_matches_job_id
      ON resume_job_matches(job_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_resume_job_matches_percentage
      ON resume_job_matches(match_percentage DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS resume_job_matches;
    `);
  }
}
