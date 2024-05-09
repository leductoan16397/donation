import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionUpdate1705070221337 implements MigrationInterface {
  name = 'TransactionUpdate1705070221337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."transactions" RENAME COLUMN "donation_id" TO "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '"2024-01-12T14:37:03.650Z"'`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."transactions" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."transactions" ADD "user_id" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '2024-01-11 17:06:41.255'`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."transactions" RENAME COLUMN "user_id" TO "donation_id"`);
  }
}
