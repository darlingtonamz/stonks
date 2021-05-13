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
exports.StocksController = void 0;
const fastify_decorators_1 = require("fastify-decorators");
const stock_dto_1 = require("../dtos/stock.dto");
const stocks_service_1 = require("../providers/stocks.service");
let StocksController = class StocksController {
    constructor(service) {
        this.service = service;
    }
    createOne({ body }, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            reply.status(201).send(yield this.service.createOneStock(body));
        });
    }
    getPeriodHighLowTradePrices({ params, query }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = query;
            return this.service.getPeriodHighLowStockPrices(params.stock_symbol, start, end);
        });
    }
    getStats({ query }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = query;
            return this.service.getStockStats(start, end);
        });
    }
};
__decorate([
    fastify_decorators_1.POST('/', {
        schema: {
            body: stock_dto_1.CreateStockSchema,
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "createOne", null);
__decorate([
    fastify_decorators_1.GET('/:stock_symbol/price'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getPeriodHighLowTradePrices", null);
__decorate([
    fastify_decorators_1.GET('/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStats", null);
StocksController = __decorate([
    fastify_decorators_1.Controller({ route: '/stocks' }),
    __metadata("design:paramtypes", [stocks_service_1.StocksService])
], StocksController);
exports.StocksController = StocksController;
exports.default = StocksController;
//# sourceMappingURL=stocks.controller.js.map