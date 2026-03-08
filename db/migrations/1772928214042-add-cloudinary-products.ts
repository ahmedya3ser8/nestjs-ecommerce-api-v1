import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCloudinaryProducts1772928214042 implements MigrationInterface {
    name = 'AddCloudinaryProducts1772928214042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "priceAfterDiscount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imageCover"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "imageCover" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" json NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imageCover"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "imageCover" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "priceAfterDiscount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT uuid_generate_v4()`);
    }

}
