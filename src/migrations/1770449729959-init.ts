import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1770449729959 implements MigrationInterface {
    name = 'Init1770449729959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("id" character varying NOT NULL, "phone_mtn" character varying, "phone_airtel" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "manager_id" integer, "subscriber_id" integer, "amount" real NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'UGX', "type" character varying, "provider" character varying, "reference" character varying, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "processed_at" TIMESTAMP, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "actorId" integer`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "details"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "details" json`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "details"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "details" jsonb`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "system_revenue" DROP COLUMN "paymentReference"`);
        await queryRunner.query(`ALTER TABLE "system_revenue" ADD "paymentReference" character varying(120)`);
        await queryRunner.query(`ALTER TABLE "system_revenue" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "system_revenue" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_d8e52aa94d0e646f99639ceaa2" ON "system_revenue" ("managerId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d8e52aa94d0e646f99639ceaa2"`);
        await queryRunner.query(`ALTER TABLE "system_revenue" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "system_revenue" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "system_revenue" DROP COLUMN "paymentReference"`);
        await queryRunner.query(`ALTER TABLE "system_revenue" ADD "paymentReference" character varying`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "details"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "details" json`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "details"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "details" jsonb`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP COLUMN "actorId"`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD "userId" integer`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "admin"`);
    }

}
