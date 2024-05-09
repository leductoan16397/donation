import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKyc1704606802407 implements MigrationInterface {
  name = 'UpdateKyc1704606802407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."kycs" RENAME COLUMN "stage" TO "state"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."kycs" RENAME COLUMN "state" TO "stage"`);
  }
}
