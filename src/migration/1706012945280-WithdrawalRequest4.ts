import { MigrationInterface, QueryRunner } from "typeorm";

export class WithdrawalRequest41706012945280 implements MigrationInterface {
    name = 'WithdrawalRequest41706012945280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donate"."donations" ADD "max_withdrawn_amount" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donate"."donations" DROP COLUMN "max_withdrawn_amount"`);
    }

}
