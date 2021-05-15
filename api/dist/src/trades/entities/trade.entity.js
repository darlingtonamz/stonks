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
exports.TradeEntity = exports.TradeTypeEnum = void 0;
const instance_entity_1 = require("../../common/entities/instance.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("../../stocks/entities/stock.entity");
var TradeTypeEnum;
(function (TradeTypeEnum) {
    TradeTypeEnum["Buy"] = "buy";
    TradeTypeEnum["Sell"] = "sell";
})(TradeTypeEnum = exports.TradeTypeEnum || (exports.TradeTypeEnum = {}));
let TradeEntity = class TradeEntity extends instance_entity_1.InstanceEntity {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TradeEntity.prototype, "type", void 0);
__decorate([
    typeorm_1.Index('idx_trades_user'),
    typeorm_1.Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TradeEntity.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], TradeEntity.prototype, "symbol", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', nullable: false }),
    __metadata("design:type", Number)
], TradeEntity.prototype, "shares", void 0);
__decorate([
    typeorm_1.Column({ type: 'float', nullable: false }),
    __metadata("design:type", Number)
], TradeEntity.prototype, "price", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], TradeEntity.prototype, "timestamp", void 0);
__decorate([
    typeorm_2.ManyToOne(() => stock_entity_1.StockEntity, (stock) => stock.trades, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'symbol', referencedColumnName: 'symbol' }),
    __metadata("design:type", stock_entity_1.StockEntity)
], TradeEntity.prototype, "stock", void 0);
TradeEntity = __decorate([
    typeorm_1.Entity('trades')
], TradeEntity);
exports.TradeEntity = TradeEntity;
//# sourceMappingURL=trade.entity.js.map