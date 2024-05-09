import { MigrationInterface, QueryRunner } from 'typeorm';

export class WithdrawalRequest31705941685894 implements MigrationInterface {
  name = 'WithdrawalRequest31705941685894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "can_withdrawn_amount" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "can_withdrawn_amount"`);
  }
}
