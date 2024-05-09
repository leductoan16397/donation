import { MigrationInterface, QueryRunner } from 'typeorm';

export class Checkout1705234814249 implements MigrationInterface {
  name = 'Checkout1705234814249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "donate"."checkouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "checkout_id" character varying NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "pay_to_email" character varying, "merchant_code" character varying, "merchant_name" character varying, "merchant_country" character varying, "purpose" character varying, "return_url" character varying NOT NULL, "redirect_url" character varying, "status" character varying, "date" TIMESTAMP, "transaction_code" character varying, "transaction_id" character varying, "transactions" json, "description" text, "donation_id" uuid NOT NULL, CONSTRAINT "PK_5800730d89f4137fc18770e4d4d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '"2024-01-14T12:20:15.413Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."checkouts" ADD CONSTRAINT "FK_c5730630257ad2547657e3d76ce" FOREIGN KEY ("donation_id") REFERENCES "donate"."donations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."checkouts" DROP CONSTRAINT "FK_c5730630257ad2547657e3d76ce"`);
    await queryRunner.query(
      `ALTER TABLE "donate"."transactions" ALTER COLUMN "transaction_date" SET DEFAULT '2024-01-13 16:41:33.558'`,
    );
    await queryRunner.query(`DROP TABLE "donate"."checkouts"`);
  }
}
