import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCloudinary1772887409825 implements MigrationInterface {
    name = 'AddCloudinary1772887409825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "image" json`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "priceAfterDiscount" TYPE integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "priceAfterDiscount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "image" character varying`);
    }

}
