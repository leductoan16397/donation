import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCheckout1705594706463 implements MigrationInterface {
  name = 'UpdateCheckout1705594706463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."checkouts" ALTER COLUMN "email" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."checkouts" ALTER COLUMN "email" SET NOT NULL`);
  }
}
