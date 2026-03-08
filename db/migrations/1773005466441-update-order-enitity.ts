import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderEnitity1773005466441 implements MigrationInterface {
    name = 'UpdateOrderEnitity1773005466441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cartItems" DROP CONSTRAINT "FK_7fac278e61eddd24a215e8bdf7c"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "priceAfterDiscount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "cartItems" ADD CONSTRAINT "FK_7fac278e61eddd24a215e8bdf7c" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cartItems" DROP CONSTRAINT "FK_7fac278e61eddd24a215e8bdf7c"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "priceAfterDiscount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "cartItems" ADD CONSTRAINT "FK_7fac278e61eddd24a215e8bdf7c" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
