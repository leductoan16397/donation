import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDonation1704819630898 implements MigrationInterface {
  name = 'UpdateDonation1704819630898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "approved_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "rejected_reason" character varying`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "approved_by_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "donate"."donations" ADD CONSTRAINT "FK_52340c6779eb4deb327b638915a" FOREIGN KEY ("approved_by_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP CONSTRAINT "FK_52340c6779eb4deb327b638915a"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "approved_by_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "rejected_reason"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "approved_at"`);
  }
}
