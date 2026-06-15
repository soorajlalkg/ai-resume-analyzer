import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResumeTable1781517155000 implements MigrationInterface {
  name = 'UpdateResumeTable1781517155000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE resumes ADD COLUMN IF NOT EXISTS extracted_text TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE resumes DROP COLUMN IF EXISTS extracted_text;
    `);
  }
}
