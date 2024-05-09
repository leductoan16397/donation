import { MigrationInterface, QueryRunner } from "typeorm";

export class WithdrawalRequest21705935099670 implements MigrationInterface {
    name = 'WithdrawalRequest21705935099670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" ADD "credit_account" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" ADD "beneficiary_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" ADD "beneficiary_bank_name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" DROP COLUMN "beneficiary_bank_name"`);
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" DROP COLUMN "beneficiary_name"`);
        await queryRunner.query(`ALTER TABLE "donate"."withdrawal_request" DROP COLUMN "credit_account"`);
    }

}
