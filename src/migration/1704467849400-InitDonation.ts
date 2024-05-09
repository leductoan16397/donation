import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDonation1704467849400 implements MigrationInterface {
  name = 'InitDonation1704467849400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "donate"."donations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" integer NOT NULL, "currency" character varying NOT NULL, "transaction_hash" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, "is_approved" boolean NOT NULL DEFAULT false, "effective_from" TIMESTAMP NOT NULL, "effective_to" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "donor_user_id" uuid, "beneficiary_user_id" uuid, CONSTRAINT "PK_c01355d6f6f50fc6d1b4a946abf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."donations" ADD CONSTRAINT "FK_7c86a86d7269a4c23b480672f7e" FOREIGN KEY ("donor_user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."donations" ADD CONSTRAINT "FK_024572fe992b4a25abcf369cbc7" FOREIGN KEY ("beneficiary_user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP CONSTRAINT "FK_024572fe992b4a25abcf369cbc7"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP CONSTRAINT "FK_7c86a86d7269a4c23b480672f7e"`);
    await queryRunner.query(`DROP TABLE "donate"."donations"`);
  }
}
