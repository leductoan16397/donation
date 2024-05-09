import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionUpdate1705164090961 implements MigrationInterface {
  name = 'TransactionUpdate1705164090961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP CONSTRAINT "FK_b9ad052c023c76284d0b6bef060"`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '"2024-01-13T16:41:33.558Z"'`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP CONSTRAINT "UQ_b9ad052c023c76284d0b6bef060"`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ADD CONSTRAINT "FK_b9ad052c023c76284d0b6bef060" FOREIGN KEY ("donation_id") REFERENCES "donate"."donations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."transactions" DROP CONSTRAINT "FK_b9ad052c023c76284d0b6bef060"`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ADD CONSTRAINT "UQ_b9ad052c023c76284d0b6bef060" UNIQUE ("donation_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '2024-01-12 14:55:49.014'`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ADD CONSTRAINT "FK_b9ad052c023c76284d0b6bef060" FOREIGN KEY ("donation_id") REFERENCES "donate"."donations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
