import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserKyc1704215480678 implements MigrationInterface {
  name = 'UserKyc1704215480678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."users" ADD "is_kyc" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."users" DROP COLUMN "is_kyc"`);
  }
}
