import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionInit1704992799534 implements MigrationInterface {
  name = 'TransactionInit1704996623543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '"2024-01-11T17:06:41.255Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '2024-01-11 16:00:29.95'`,
    );
  }
}
