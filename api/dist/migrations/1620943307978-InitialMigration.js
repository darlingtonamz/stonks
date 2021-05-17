"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1620943307978 = void 0;
class InitialMigration1620943307978 {
    constructor() {
        this.name = 'InitialMigration1620943307978';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "trades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "type" character varying NOT NULL, "user" jsonb, "symbol" text NOT NULL, "shares" integer NOT NULL, "price" double precision NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c6d7c36a837411ba5194dc58595" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "stocks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "symbol" text NOT NULL, CONSTRAINT "UQ_STOCK_SYMBOL" UNIQUE ("symbol"), CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "trades" ADD CONSTRAINT "FK_b8d8c2afc2b81a723e0d8cd4af6" FOREIGN KEY ("symbol") REFERENCES "stocks"("symbol") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "trades" DROP CONSTRAINT "FK_b8d8c2afc2b81a723e0d8cd4af6"`);
            yield queryRunner.query(`DROP TABLE "stocks"`);
            yield queryRunner.query(`DROP TABLE "trades"`);
        });
    }
}
exports.InitialMigration1620943307978 = InitialMigration1620943307978;
//# sourceMappingURL=1620943307978-InitialMigration.js.map