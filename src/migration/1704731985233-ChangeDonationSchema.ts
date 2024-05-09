import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDonationSchema1704731985233 implements MigrationInterface {
  name = 'ChangeDonationSchema1704731985233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP CONSTRAINT "FK_7c86a86d7269a4c23b480672f7e"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP CONSTRAINT "FK_024572fe992b4a25abcf369cbc7"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "amount"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "currency"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "transaction_hash"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "is_approved"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "donor_user_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "beneficiary_user_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "target_amount" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "name" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "donate"."donations" ADD "kyc_status" character varying NOT NULL DEFAULT 'NO_VERIFY'`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "type" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "thumbnail" character varying`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "images" text array NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "transaction_codes" text array NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "owner_id" uuid`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "description" text`);
    await queryRunner.query(
      `ALTER TABLE "donate"."donations" ADD CONSTRAINT "FK_bf2f1e3276e3ab87e5a7728c2aa" FOREIGN KEY ("owner_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP CONSTRAINT "FK_bf2f1e3276e3ab87e5a7728c2aa"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "description" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "transaction_codes"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "thumbnail"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "kyc_status"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "target_amount"`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "beneficiary_user_id" uuid`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "donor_user_id" uuid`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "is_approved" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "transaction_hash" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "currency" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "amount" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "donate"."donations" ADD CONSTRAINT "FK_024572fe992b4a25abcf369cbc7" FOREIGN KEY ("beneficiary_user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."donations" ADD CONSTRAINT "FK_7c86a86d7269a4c23b480672f7e" FOREIGN KEY ("donor_user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
