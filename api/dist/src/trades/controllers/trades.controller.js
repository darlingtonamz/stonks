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
const fastify_decorators_1 = require("fastify-decorators");
const trade_dto_1 = require("../dtos/trade.dto");
const trades_service_1 = require("../providers/trades.service");
const date_fns_1 = require("date-fns");
function tradeSerializer(data) {
    let output;
    if (Array.isArray(data)) {
        output = data.map((trade) => {
            trade.timestamp = date_fns_1.format(trade.timestamp, 'yyyy-MM-dd HH:mm:SS');
        });
    }
    else {
        output = Object.assign(Object.assign({}, data), { timestamp: date_fns_1.format(data.timestamp, 'yyyy-MM-dd HH:mm:SS') });
    }
    return JSON.stringify(output);
}
;
let TradesController = class TradesController {
    constructor(service) {
        this.service = service;
    }
    getMany() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getManyTrades();
        });
    }
    createOne({ body }, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            reply
                .status(201)
                .header('Content-Type', 'application/json')
                .serializer(tradeSerializer);
            return this.service.createOneTrade(body, reply);
        });
    }
    getManyByUserId({ params }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getManyTradesByUserId(params.user_id);
        });
    }
};
__decorate([
    fastify_decorators_1.GET('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradesController.prototype, "getMany", null);
__decorate([
    fastify_decorators_1.POST('/', {
        schema: {
            body: trade_dto_1.CreateTradeSchema,
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TradesController.prototype, "createOne", null);
__decorate([
    fastify_decorators_1.GET('/users/:user_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TradesController.prototype, "getManyByUserId", null);
TradesController = __decorate([
    fastify_decorators_1.Controller({ route: '/trades' }),
    __metadata("design:paramtypes", [trades_service_1.TradesService])
], TradesController);
exports.TradesController = TradesController;
exports.default = TradesController;
//# sourceMappingURL=trades.controller.js.map