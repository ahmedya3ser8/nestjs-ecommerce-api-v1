import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCloudinaryUsers1772920041154 implements MigrationInterface {
    name = 'AddCloudinaryUsers1772920041154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "priceAfterDiscount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "priceAfterDiscount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT uuid_generate_v4()`);
    }

}
