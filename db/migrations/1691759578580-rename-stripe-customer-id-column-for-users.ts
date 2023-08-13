import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameStripeCustomerIdColumnForUsers1691759578580 implements MigrationInterface {
    name = 'RenameStripeCustomerIdColumnForUsers1691759578580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stipeCustomerId" TO "stripeCustomerId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stripeCustomerId" TO "stipeCustomerId"`);
    }

}
