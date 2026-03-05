import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1772738071269 implements MigrationInterface {
    name = 'Initial1772738071269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "brands" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying(500), "image" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "UQ_b15428f362be2200922952dc268" UNIQUE ("slug"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying(500), "image" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subCategories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying(500), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "categoryId" integer, CONSTRAINT "PK_d22319d65c44efc1d19c4a08989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wishlists" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "userId" integer, "productId" integer, CONSTRAINT "PK_d0a37f2848c5d268d315325f359" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5629f2896ea05ee200f7a96af4" ON "wishlists" ("userId", "productId") `);
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "totalCartPrice" numeric(10,2) NOT NULL DEFAULT '0', "totalPriceAfterDiscount" numeric(10,2), "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cartItems" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "productId" integer, "cartId" integer, CONSTRAINT "PK_bb4f983020f59696f40ea04d6a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentmethodtype_enum" AS ENUM('cash', 'card')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_orderstatus_enum" AS ENUM('processing', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('pending', 'paid', 'failed', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "orderNumber" uuid NOT NULL DEFAULT gen_random_uuid(), "taxPrice" numeric(10,2) NOT NULL DEFAULT '0', "shippingPrice" numeric(10,2) NOT NULL DEFAULT '0', "totalOrderPrice" numeric(10,2) NOT NULL, "paymentMethodType" "public"."orders_paymentmethodtype_enum" NOT NULL DEFAULT 'cash', "orderStatus" "public"."orders_orderstatus_enum" NOT NULL DEFAULT 'processing', "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'pending', "paidAt" TIMESTAMP, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "userId" integer, "shippingAddressId" integer, CONSTRAINT "UQ_59b0c3b34ea0fa5562342f24143" UNIQUE ("orderNumber"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orderItems" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "productId" integer, "orderId" integer, CONSTRAINT "PK_b1b864ba2b7d5762d34265cc8b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "sold" integer DEFAULT '0', "price" integer NOT NULL, "priceAfterDiscount" integer, "colors" text array NOT NULL DEFAULT '{}', "imageCover" character varying NOT NULL, "images" text array NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, "ratingAverage" double precision NOT NULL DEFAULT '0', "ratingQuantity" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "brandId" integer, "subCategoryId" integer, CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "rating" double precision NOT NULL, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "userId" integer, "productId" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "profileImage" character varying, "passwordChangedAt" TIMESTAMP, "passwordResetCode" character varying, "passwordResetExpires" TIMESTAMP, "passwordResetVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addressess" ("id" SERIAL NOT NULL, "phone" character varying, "city" character varying NOT NULL, "postalcode" character varying NOT NULL, "street" character varying NOT NULL, "state" character varying, "country" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_29e1de3a3ec50623faa67c83f6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."coupons_discounttype_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`CREATE TABLE "coupons" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "discountType" "public"."coupons_discounttype_enum" NOT NULL DEFAULT 'percentage', "discountValue" numeric(10,2) NOT NULL, "usageLimit" integer NOT NULL DEFAULT '0', "usedCount" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP(6) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT now(), CONSTRAINT "UQ_e025109230e82925843f2a14c48" UNIQUE ("code"), CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subCategories" ADD CONSTRAINT "FK_efae0678cf0a02d117ad51790df" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlists" ADD CONSTRAINT "FK_4f3c30555daa6ab0b70a1db772c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlists" ADD CONSTRAINT "FK_063c6f46d6cbebf35f3a5ec3d4e" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cartItems" ADD CONSTRAINT "FK_f2c97dd179feb55be1b354fb548" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cartItems" ADD CONSTRAINT "FK_7fac278e61eddd24a215e8bdf7c" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d" FOREIGN KEY ("shippingAddressId") REFERENCES "addressess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orderItems" ADD CONSTRAINT "FK_51d8fc35a95624166faeca65e86" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orderItems" ADD CONSTRAINT "FK_391c9e5d5af8d7d7ce4b96db80e" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_ad42985fb27aa9016b16ee740ec" FOREIGN KEY ("subCategoryId") REFERENCES "subCategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addressess" ADD CONSTRAINT "FK_aac77a030488f4a94c200efedcb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addressess" DROP CONSTRAINT "FK_aac77a030488f4a94c200efedcb"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ad42985fb27aa9016b16ee740ec"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`);
        await queryRunner.query(`ALTER TABLE "orderItems" DROP CONSTRAINT "FK_391c9e5d5af8d7d7ce4b96db80e"`);
        await queryRunner.query(`ALTER TABLE "orderItems" DROP CONSTRAINT "FK_51d8fc35a95624166faeca65e86"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "cartItems" DROP CONSTRAINT "FK_7fac278e61eddd24a215e8bdf7c"`);
        await queryRunner.query(`ALTER TABLE "cartItems" DROP CONSTRAINT "FK_f2c97dd179feb55be1b354fb548"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "wishlists" DROP CONSTRAINT "FK_063c6f46d6cbebf35f3a5ec3d4e"`);
        await queryRunner.query(`ALTER TABLE "wishlists" DROP CONSTRAINT "FK_4f3c30555daa6ab0b70a1db772c"`);
        await queryRunner.query(`ALTER TABLE "subCategories" DROP CONSTRAINT "FK_efae0678cf0a02d117ad51790df"`);
        await queryRunner.query(`DROP TABLE "coupons"`);
        await queryRunner.query(`DROP TYPE "public"."coupons_discounttype_enum"`);
        await queryRunner.query(`DROP TABLE "addressess"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "orderItems"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentmethodtype_enum"`);
        await queryRunner.query(`DROP TABLE "cartItems"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5629f2896ea05ee200f7a96af4"`);
        await queryRunner.query(`DROP TABLE "wishlists"`);
        await queryRunner.query(`DROP TABLE "subCategories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "brands"`);
    }

}
