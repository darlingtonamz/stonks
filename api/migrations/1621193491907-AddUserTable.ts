import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserTable1621193491907 implements MigrationInterface {
    name = 'AddUserTable1621193491907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_trades_user" ON "trades" ("user") `);
        await queryRunner.query(`CREATE INDEX "idx_stocks_symbol" ON "stocks" ("symbol") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_stocks_symbol"`);
        await queryRunner.query(`DROP INDEX "idx_trades_user"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
