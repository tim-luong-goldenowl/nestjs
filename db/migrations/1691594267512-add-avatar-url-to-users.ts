import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarUrlToUsers1691594267512 implements MigrationInterface {
    name = 'AddAvatarUrlToUsers1691594267512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
    }

}
