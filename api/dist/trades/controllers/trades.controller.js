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
exports.TradesController = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const fastify_decorators_1 = require("fastify-decorators");
const trade_dto_1 = require("../dtos/trade.dto");
const trades_service_1 = require("../providers/trades.service");
let TradesController = class TradesController {
    constructor(service) {
        this.service = service;
    }
    helloHandler(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.hello(request.body);
        });
    }
    goodbyeHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'Bye-bye!!';
        });
    }
};
__decorate([
    fastify_decorators_1.GET('/', {
        validatorCompiler: () => (data) => __awaiter(void 0, void 0, void 0, function* () {
            const object = class_transformer_1.plainToClass(trade_dto_1.CreateTradeDTO, data);
            const errors = yield class_validator_1.validate(object);
            return errors.length > 0 ? { error: errors } : { value: data };
        })
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TradesController.prototype, "helloHandler", null);
__decorate([
    fastify_decorators_1.GET({ url: '/goodbye' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradesController.prototype, "goodbyeHandler", null);
TradesController = __decorate([
    fastify_decorators_1.Controller({ route: '/trades' }),
    __metadata("design:paramtypes", [trades_service_1.TradesService])
], TradesController);
exports.TradesController = TradesController;
exports.default = TradesController;
//# sourceMappingURL=trades.controller.js.map