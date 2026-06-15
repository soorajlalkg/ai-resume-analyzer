import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResumeTables1781517138000 implements MigrationInterface {
  name = 'CreateResumeTables1781517138000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE resumes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id UUID NOT NULL,

        file_name TEXT NOT NULL,
        file_key TEXT NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT fk_resumes_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_resumes_user_id
      ON resumes(user_id);
    `);

    await queryRunner.query(`
      CREATE TABLE job_descriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id UUID NOT NULL,

        title TEXT NOT NULL,
        company_name TEXT,
        description TEXT NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT fk_job_descriptions_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_job_descriptions_user_id
      ON job_descriptions(user_id);
    `);

    await queryRunner.query(`
      CREATE TABLE analysis_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        resume_id UUID NOT NULL,
        job_description_id UUID NOT NULL,

        match_percentage FLOAT NOT NULL,

        strengths JSON,
        missing_skills JSON,

        recommendations JSON NOT NULL,

        summary TEXT NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT fk_analysis_reports_resume
          FOREIGN KEY (resume_id)
          REFERENCES resumes(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_analysis_reports_job_description
          FOREIGN KEY (job_description_id)
          REFERENCES job_descriptions(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_analysis_reports_resume_id
      ON analysis_reports(resume_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_analysis_reports_job_description_id
      ON analysis_reports(job_description_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS analysis_reports;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS job_descriptions;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS resumes;
    `);
  }
}
