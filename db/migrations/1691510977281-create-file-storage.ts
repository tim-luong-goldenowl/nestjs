import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileStorage1691510977281 implements MigrationInterface {
    name = 'CreateFileStorage1691510977281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file_storage" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, CONSTRAINT "PK_2834b5398654dd125afabfd0dc2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "file_storage"`);
    }

}
