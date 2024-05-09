import { MigrationInterface, QueryRunner } from 'typeorm';

export class CheckoutUpdate1705235362512 implements MigrationInterface {
  name = 'CheckoutUpdate1705235362512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '"2024-01-14T12:29:23.709Z"'`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."checkouts" ALTER COLUMN "checkout_id" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."checkouts" ALTER COLUMN "checkout_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '2024-01-14 12:20:15.413'`,
    );
  }
}
