import { MigrationInterface, QueryRunner } from 'typeorm';

export class DonationChangeTransactionCode1704907905632 implements MigrationInterface {
  name = 'DonationChangeTransactionCode1704907905632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "transaction_code" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "transaction_code"`);
  }
}
