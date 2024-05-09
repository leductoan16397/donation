import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1703436795003 implements MigrationInterface {
  name = 'Init1703436795003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "donate"."otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "action" character varying NOT NULL, "email" character varying NOT NULL, "code" character varying NOT NULL, "current_valid" integer NOT NULL, "limit_invalid" integer NOT NULL, "expire_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donate"."block_otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "num_request" integer NOT NULL, "expire_time" TIMESTAMP, "expire_block_time" TIMESTAMP, "status" character varying NOT NULL, CONSTRAINT "PK_3b108a35f3fdd36c3331ea049c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donate"."refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "donate"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "salt" character varying NOT NULL, "email" character varying NOT NULL, "pin" character varying NOT NULL, "hashed_password" character varying NOT NULL, "country" character varying NOT NULL, "role" character varying NOT NULL, "company_id" character varying, "phone" character varying, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "donate"."refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
    await queryRunner.query(`DROP TABLE "donate"."users"`);
    await queryRunner.query(`DROP TABLE "donate"."refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "donate"."block_otps"`);
    await queryRunner.query(`DROP TABLE "donate"."otps"`);
  }
}
