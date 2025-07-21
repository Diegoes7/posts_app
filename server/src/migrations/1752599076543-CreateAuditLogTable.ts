import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogTable1752599076543 implements MigrationInterface {
    name = 'CreateAuditLogTable1752599076543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "action"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "ratingPts" integer`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "actorId" integer`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "timestamp" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "event" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "event"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "actorId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ratingPts"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "action" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "userId" integer NOT NULL`);
    }

}
