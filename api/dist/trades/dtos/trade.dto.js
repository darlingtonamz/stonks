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
exports.CreateTradeDTO = exports.TradeUserDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class TradeUserDTO {
}
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], TradeUserDTO.prototype, "id", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], TradeUserDTO.prototype, "name", void 0);
exports.TradeUserDTO = TradeUserDTO;
class CreateTradeDTO {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateTradeDTO.prototype, "type", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsObject(),
    class_validator_1.ValidateNested(),
    class_transformer_1.Type(() => TradeUserDTO),
    __metadata("design:type", TradeUserDTO)
], CreateTradeDTO.prototype, "user", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateTradeDTO.prototype, "symbol", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsInt(),
    __metadata("design:type", Number)
], CreateTradeDTO.prototype, "shares", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], CreateTradeDTO.prototype, "price", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDefined(),
    class_validator_1.IsString(),
    __metadata("design:type", Date)
], CreateTradeDTO.prototype, "timestamp", void 0);
exports.CreateTradeDTO = CreateTradeDTO;
//# sourceMappingURL=trade.dto.js.map