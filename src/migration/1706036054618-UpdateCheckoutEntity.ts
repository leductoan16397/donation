import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCheckoutEntity1706036054618 implements MigrationInterface {
    name = 'UpdateCheckoutEntity1706036054618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" DROP COLUMN "request_amount"`);
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" ADD "request_amount" double precision DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "target_amount"`);
        await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "target_amount" double precision DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "donate"."checkouts" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "donate"."checkouts" ADD "amount" double precision DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donate"."checkouts" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "donate"."checkouts" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "target_amount"`);
        await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "target_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" DROP COLUMN "request_amount"`);
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" ADD "request_amount" integer NOT NULL`);
    }

}
