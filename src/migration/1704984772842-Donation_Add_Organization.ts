import { MigrationInterface, QueryRunner } from 'typeorm';

export class DonationAddOrganization1704984772842 implements MigrationInterface {
  name = 'DonationAddOrganization1704984772842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "organization" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "organization"`);
  }
}
