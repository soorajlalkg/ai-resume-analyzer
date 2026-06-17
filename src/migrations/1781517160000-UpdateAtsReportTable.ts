import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAtsReportTable1781517160000 implements MigrationInterface {
  name = 'UpdateAtsReportTable1781517160000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ats_reports RENAME COLUMN match_percentage TO score;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ats_reports RENAME COLUMN score TO match_percentage;
    `);
  }
}
