import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUsers1690212553734 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    firstName VARCHAR (50),
                    lastName VARCHAR (50),
                    password character varying NOT NULL,
                    dob DATE,
                    email VARCHAR (50) UNIQUE,
                    createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
                    updatedAt DATE NOT NULL DEFAULT CURRENT_DATE,
                );
            `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
