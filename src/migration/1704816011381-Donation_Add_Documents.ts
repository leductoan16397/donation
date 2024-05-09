import { MigrationInterface, QueryRunner } from 'typeorm';

export class DonationAddDocuments1704816011381 implements MigrationInterface {
  name = 'DonationAddDocuments1704816011381';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "documents" text array`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ALTER COLUMN "images" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ALTER COLUMN "transaction_codes" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" ALTER COLUMN "transaction_codes" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ALTER COLUMN "images" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "documents"`);
  }
}
