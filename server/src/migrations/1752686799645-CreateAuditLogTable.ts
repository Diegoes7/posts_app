import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogTable1752686799645 implements MigrationInterface {
    name = 'CreateAuditLogTable1752686799645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "popularityPts" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "popularityPts"`);
    }

}
