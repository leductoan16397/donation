import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCheckout1705678690891 implements MigrationInterface {
  name = 'UpdateCheckout1705678690891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."checkouts" ALTER COLUMN "name" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."checkouts" ALTER COLUMN "name" SET NOT NULL`);
  }
}
