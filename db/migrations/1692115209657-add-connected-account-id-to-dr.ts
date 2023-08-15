import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConnectedAccountIdToDr1692115209657 implements MigrationInterface {
    name = 'AddConnectedAccountIdToDr1692115209657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" ADD "stripeConnectedAccountId" character varying NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" DROP COLUMN "stripeConnectedAccountId"`);
    }

}
