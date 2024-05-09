import { MigrationInterface, QueryRunner } from 'typeorm';

export class WithdrawalRequestInit1705500815469 implements MigrationInterface {
  name = 'WithdrawalRequestInit1705500815469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "donate"."withdrawal_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "request_amount" integer NOT NULL, "description" text, "status" character varying NOT NULL, "approved_at" TIMESTAMP, "rejected_reason" character varying, "deleted_at" TIMESTAMP, "owner_id" uuid, "approved_by_id" uuid, CONSTRAINT "PK_bc9a9e96931501edf31e665327f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" ADD CONSTRAINT "FK_3afbb4d71a84f80f00b64020495" FOREIGN KEY ("owner_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" ADD CONSTRAINT "FK_97009b65cb9ae5d978884ad6b48" FOREIGN KEY ("approved_by_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" DROP CONSTRAINT "FK_97009b65cb9ae5d978884ad6b48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" DROP CONSTRAINT "FK_3afbb4d71a84f80f00b64020495"`,
    );
    await queryRunner.query(`DROP TABLE "donate"."withdrawal_request"`);
  }
}
