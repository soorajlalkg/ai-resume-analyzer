import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1710000000000 implements MigrationInterface {
  name = 'CreateTables1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE user_type_enum AS ENUM (
        'ADMIN',
        'USER'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,

        type user_type_enum NOT NULL,
        is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        profile_url TEXT,

        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE user_verifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        user_id UUID NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        verified_at TIMESTAMP,

        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT fk_user_verifications_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_user_verifications_user_id
      ON user_verifications(user_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS user_verifications;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS users;
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS user_type_enum;
    `);
  }
}
