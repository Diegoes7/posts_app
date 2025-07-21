import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogTable1752597945486 implements MigrationInterface {
    name = 'CreateAuditLogTable1752597945486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "ratingPts" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ratingPts"`);
    }

}
