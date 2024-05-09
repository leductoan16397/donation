import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1704996623443 implements MigrationInterface {
  name = 'Transaction1704996623443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "donate"."transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "donation_id" character varying NOT NULL, "code" character varying NOT NULL, "description" text, "status" character varying NOT NULL, "transaction_date" TIMESTAMP NOT NULL DEFAULT '"2024-01-11T18:10:28.447Z"', "amount" integer NOT NULL, "payment_method" character varying, "deleted_at" TIMESTAMP, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "transaction_codes"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "transaction_codes" text array`);
    await queryRunner.query(`DROP TABLE "donate"."transactions"`);
  }
}
