import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStripeCustomerIdToUsers1691748323936 implements MigrationInterface {
    name = 'AddStripeCustomerIdToUsers1691748323936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "stipeCustomerId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stipeCustomerId"`);
    }

}
