import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNullableForDonationReceivers1692029269450 implements MigrationInterface {
    name = 'ChangeNullableForDonationReceivers1692029269450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "businessName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "companyName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "country" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "companyName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "businessName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "donation_receiver" ALTER COLUMN "email" SET NOT NULL`);
    }

}
