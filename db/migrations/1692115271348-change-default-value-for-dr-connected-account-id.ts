import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDefaultValueForDrConnectedAccountId1692115271348 implements MigrationInterface {
    name = 'ChangeDefaultValueForDrConnectedAccountId1692115271348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "stripeConnectedAccountId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "stripeConnectedAccountId" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "stripeConnectedAccountId" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "stripeConnectedAccountId" SET NOT NULL`);
    }

}
