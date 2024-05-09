import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCompany1704208983427 implements MigrationInterface {
  name = 'RemoveCompany1704208983427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."users" DROP COLUMN "company_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."users" ADD "company_id" character varying`);
  }
}
