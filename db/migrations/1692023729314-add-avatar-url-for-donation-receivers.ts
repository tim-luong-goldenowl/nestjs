import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarUrlForDonationReceivers1692023729314 implements MigrationInterface {
    name = 'AddAvatarUrlForDonationReceivers1692023729314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" ADD "avatarUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donation_receiver" DROP COLUMN "avatarUrl"`);
    }

}
