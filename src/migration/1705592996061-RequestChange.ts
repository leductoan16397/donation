import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequestChange1705592996061 implements MigrationInterface {
  name = 'RequestChange1705592996061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "donate"."donation_request_changes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "effective_to" TIMESTAMP, "target_amount" integer, "approved_at" TIMESTAMP, "rejected_reason" character varying, "kyc_status" character varying NOT NULL DEFAULT 'NO_VERIFY', "approved_by_id" uuid, "donation_id" uuid, CONSTRAINT "PK_1d9f6386c3f35ed2d3b9a452799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."donation_request_changes" ADD CONSTRAINT "FK_bed9379a8d3883c0fea54350e2a" FOREIGN KEY ("approved_by_id") REFERENCES "donate"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."donation_request_changes" ADD CONSTRAINT "FK_a6f4eb23c1263a150b085831719" FOREIGN KEY ("donation_id") REFERENCES "donate"."donations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "donate"."donation_request_changes" DROP CONSTRAINT "FK_a6f4eb23c1263a150b085831719"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donate"."donation_request_changes" DROP CONSTRAINT "FK_bed9379a8d3883c0fea54350e2a"`,
    );
    await queryRunner.query(`DROP TABLE "donate"."donation_request_changes"`);
  }
}
