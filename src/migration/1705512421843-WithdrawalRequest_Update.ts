import { MigrationInterface, QueryRunner } from 'typeorm';

export class WithdrawalRequestUpdate1705512421843 implements MigrationInterface {
  name = 'WithdrawalRequestUpdate1705512421843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" DROP CONSTRAINT "FK_3afbb4d71a84f80f00b64020495"`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" DROP COLUMN "owner_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" ADD "user_id" uuid`);
    await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" ADD "donation_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" ADD CONSTRAINT "FK_4ce84fe3aedc8b7ab5fd998ad9f" FOREIGN KEY ("user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" ADD CONSTRAINT "FK_b67c330126b12fa825ed6585bb9" FOREIGN KEY ("donation_id") REFERENCES "donate"."donations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" DROP CONSTRAINT "FK_b67c330126b12fa825ed6585bb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" DROP CONSTRAINT "FK_4ce84fe3aedc8b7ab5fd998ad9f"`,
    );
    await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" DROP COLUMN "donation_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" ADD "owner_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "donate"."withdrawal_request" ADD CONSTRAINT "FK_3afbb4d71a84f80f00b64020495" FOREIGN KEY ("owner_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
