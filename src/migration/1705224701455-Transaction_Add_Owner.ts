import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionAddOwner1705224701455 implements MigrationInterface {
  name = 'TransactionAddOwner1705224701455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP COLUMN "payment_method"`);
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."transactions" ADD "transaction_owner" json`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '"2024-01-14T09:31:44.738Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '2024-01-13 16:41:33.558'`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP COLUMN "transaction_owner"`);
    await queryRunner.query(`ALTER TABLE "donate"."transactions" ADD "user_id" uuid`);
    await queryRunner.query(`ALTER TABLE "donate"."transactions" ADD "payment_method" character varying`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
