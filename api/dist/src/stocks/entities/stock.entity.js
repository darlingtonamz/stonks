"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockEntity = void 0;
const instance_entity_1 = require("../../common/entities/instance.entity");
const typeorm_1 = require("typeorm");
const trade_entity_1 = require("../../trades/entities/trade.entity");
let StockEntity = class StockEntity extends instance_entity_1.InstanceEntity {
};
__decorate([
    typeorm_1.Index('idx_stocks_symbol'),
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], StockEntity.prototype, "symbol", void 0);
__decorate([
    typeorm_1.OneToMany(() => trade_entity_1.TradeEntity, (trade) => trade.stock),
    __metadata("design:type", Array)
], StockEntity.prototype, "trades", void 0);
StockEntity = __decorate([
    typeorm_1.Entity('stocks'),
    typeorm_1.Unique("UQ_STOCK_SYMBOL", ["symbol"])
], StockEntity);
exports.StockEntity = StockEntity;
//# sourceMappingURL=stock.entity.js.map