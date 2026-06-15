import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAtsReportTables1781517140000 implements MigrationInterface {
  name = 'CreateAtsReportTables1781517140000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE ats_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        resume_id UUID NOT NULL,

        match_percentage FLOAT NOT NULL,

        strengths JSON,
        missing_skills JSON,

        recommendations JSON NOT NULL,

        summary TEXT NOT NULL,

        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT fk_ats_reports_resume
          FOREIGN KEY (resume_id)
          REFERENCES resumes(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_ats_reports_resume_id
      ON ats_reports(resume_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS ats_reports;
    `);
  }
}
