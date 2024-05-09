import { MigrationInterface, QueryRunner } from 'typeorm';

export class Kyc1704390187040 implements MigrationInterface {
  name = 'Kyc1704390187040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "rejected_reason" character varying`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP CONSTRAINT "FK_3fdb25829f48b2fe65758453dbf"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP CONSTRAINT "REL_bbfe1fa864841e82cff1be09e8"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP CONSTRAINT "REL_3fdb25829f48b2fe65758453db"`);
    await queryRunner.query(
      `ALTER TABLE "donate"."kycs" ADD CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b" FOREIGN KEY ("user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."kycs" ADD CONSTRAINT "FK_3fdb25829f48b2fe65758453dbf" FOREIGN KEY ("approved_by_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP CONSTRAINT "FK_3fdb25829f48b2fe65758453dbf"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b"`);
    await queryRunner.query(
      `ALTER TABLE "donate"."kycs" ADD CONSTRAINT "REL_3fdb25829f48b2fe65758453db" UNIQUE ("approved_by_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."kycs" ADD CONSTRAINT "REL_bbfe1fa864841e82cff1be09e8" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."kycs" ADD CONSTRAINT "FK_3fdb25829f48b2fe65758453dbf" FOREIGN KEY ("approved_by_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."kycs" ADD CONSTRAINT "FK_bbfe1fa864841e82cff1be09e8b" FOREIGN KEY ("user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "rejected_reason"`);
  }
}
