import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStocksTable1620923144033 implements MigrationInterface {
    name = 'AddStocksTable1620923144033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stocks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "symbol" text NOT NULL, CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "type" character varying NOT NULL, "user" jsonb, "symbol" text NOT NULL, "shares" integer NOT NULL, "price" double precision NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "trades"`);
        await queryRunner.query(`DROP TABLE "stocks"`);
    }

}
