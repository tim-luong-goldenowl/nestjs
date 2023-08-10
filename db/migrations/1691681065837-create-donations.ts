import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDonations1691681065837 implements MigrationInterface {
    name = 'CreateDonations1691681065837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donation" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "value" integer NOT NULL, "userId" integer, "donationReceiverId" integer, CONSTRAINT "PK_25fb5a541964bc5cfc18fb13a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_25fb5a541964bc5cfc18fb13a8" ON "donation" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b1b04dd36f188d633ab3cfcff8" ON "donation_receiver" ("id") `);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_063499388657e648418470a439a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "donation" ADD CONSTRAINT "FK_1753e0d7941483c4da3b76edda9" FOREIGN KEY ("donationReceiverId") REFERENCES "donation_receiver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_1753e0d7941483c4da3b76edda9"`);
        await queryRunner.query(`ALTER TABLE "donation" DROP CONSTRAINT "FK_063499388657e648418470a439a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1b04dd36f188d633ab3cfcff8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25fb5a541964bc5cfc18fb13a8"`);
        await queryRunner.query(`DROP TABLE "donation"`);
    }

}
