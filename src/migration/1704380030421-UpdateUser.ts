import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1704380030421 implements MigrationInterface {
  name = 'UpdateUser1704380030421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."users" DROP COLUMN "pin"`);
    await queryRunner.query(`ALTER TABLE "donate"."users" ALTER COLUMN "country" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."users" ALTER COLUMN "country" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."users" ADD "pin" character varying NOT NULL`);
  }
}
