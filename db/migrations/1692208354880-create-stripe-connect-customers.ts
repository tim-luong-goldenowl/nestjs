import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStripeConnectCustomers1692208354880 implements MigrationInterface {
    name = 'CreateStripeConnectCustomers1692208354880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stripe_connect_customer" ("id" SERIAL NOT NULL, "customerId" character varying NOT NULL, "userId" integer, "donationReceiverId" integer, CONSTRAINT "PK_1d4c3f43fb45ed0040dd2e929fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1d4c3f43fb45ed0040dd2e929f" ON "stripe_connect_customer" ("id") `);
        await queryRunner.query(`ALTER TABLE "stripe_connect_customer" ADD CONSTRAINT "FK_6a084278ee19a4e7a7ab8a00931" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stripe_connect_customer" ADD CONSTRAINT "FK_54910f05337677b9492406763a0" FOREIGN KEY ("donationReceiverId") REFERENCES "donation_receiver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stripe_connect_customer" DROP CONSTRAINT "FK_54910f05337677b9492406763a0"`);
        await queryRunner.query(`ALTER TABLE "stripe_connect_customer" DROP CONSTRAINT "FK_6a084278ee19a4e7a7ab8a00931"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d4c3f43fb45ed0040dd2e929f"`);
        await queryRunner.query(`DROP TABLE "stripe_connect_customer"`);
    }

}
