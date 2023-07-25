import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1690292137795 implements MigrationInterface {
    name = 'CreateUsers1690292137795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "dob" TIMESTAMP, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "donation_receiver" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "businessName" character varying NOT NULL, "companyName" character varying NOT NULL, "country" character varying NOT NULL, "onboardingCompleteToken" character varying, "verified" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "REL_47bdfe79921f4958fb0fa0b3eb" UNIQUE ("userId"), CONSTRAINT "PK_b1b04dd36f188d633ab3cfcff85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ADD CONSTRAINT "FK_47bdfe79921f4958fb0fa0b3eb9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" DROP CONSTRAINT "FK_47bdfe79921f4958fb0fa0b3eb9"`);
        await queryRunner.query(`DROP TABLE "donation_receiver"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
