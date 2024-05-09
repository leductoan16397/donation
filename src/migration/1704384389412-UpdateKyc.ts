import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKyc1704384389412 implements MigrationInterface {
  name = 'UpdateKyc1704384389412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."users" RENAME COLUMN "is_kyc" TO "kyc_status"`);
    await queryRunner.query(
      `CREATE TABLE "donate"."kycs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "files" text array NOT NULL DEFAULT '{}', "approved_at" TIMESTAMP, "deleted_at" TIMESTAMP, "user_id" uuid, "approved_by_id" uuid, CONSTRAINT "REL_bbfe1fa864841e82cff1be09e8" UNIQUE ("user_id"), CONSTRAINT "REL_3fdb25829f48b2fe65758453db" UNIQUE ("approved_by_id"), CONSTRAINT "PK_6e61a5975007a8dae889765bbbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."users" DROP COLUMN "kyc_status"`);
    await queryRunner.query(
      `ALTER TABLE "donate"."users" ADD "kyc_status" character varying NOT NULL DEFAULT 'NO_VERIFY'`,
    );
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
    await queryRunner.query(`ALTER TABLE "donate"."users" DROP COLUMN "kyc_status"`);
    await queryRunner.query(`ALTER TABLE "donate"."users" ADD "kyc_status" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`DROP TABLE "donate"."kycs"`);
    await queryRunner.query(`ALTER TABLE "donate"."users" RENAME COLUMN "kyc_status" TO "is_kyc"`);
  }
}
