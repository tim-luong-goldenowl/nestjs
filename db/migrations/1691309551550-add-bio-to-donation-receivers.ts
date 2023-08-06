import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBioToDonationReceivers1691309551550 implements MigrationInterface {
    name = 'AddBioToDonationReceivers1691309551550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" ADD "bio" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" DROP COLUMN "bio"`);
    }

}
