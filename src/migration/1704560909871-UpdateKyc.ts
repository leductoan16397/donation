import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKyc1704560909871 implements MigrationInterface {
  name = 'UpdateKyc1704560909871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "full_name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "avatar" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "gender" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "birthday" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "email" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "phone" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "country" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "address" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "stage" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "city" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "zip_code" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" ADD "about" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "about"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "zip_code"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "stage"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "birthday"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "donate"."kycs" DROP COLUMN "full_name"`);
  }
}
