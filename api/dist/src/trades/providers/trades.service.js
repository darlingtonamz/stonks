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
exports.TradesService = void 0;
const fastify_decorators_1 = require("fastify-decorators");
const trade_entity_1 = require("../entities/trade.entity");
const connection_service_1 = require("../../db/providers/connection.service");
const date_fns_1 = require("date-fns");
const stocks_service_1 = require("../../stocks/providers/stocks.service");
let TradesService = class TradesService {
    constructor(connectionService) {
        this.connectionService = connectionService;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.repository = this.connectionService.connection.getRepository(trade_entity_1.TradeEntity);
        });
    }
    hello(body) {
        return `Hello world! ${JSON.stringify(body)}`;
    }
    getOneTrade(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let trade;
            try {
                trade = yield this.repository.findOne(query, options);
            }
            catch (e) {
                throw { statusCode: 500, message: e };
            }
            if (!trade) {
                throw { statusCode: 404, message: `Trade ${JSON.stringify(query)} not found` };
            }
            return trade;
        });
    }
    getManyTrades() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find();
        });
    }
    createOneTrade(body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stocksService.getOneStock({ symbol: body.symbol });
            if (body.timestamp) {
                const parsed = date_fns_1.parse(body.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date()).toDateString();
                if (parsed == 'Invalid Date') {
                    throw { statusCode: 400, message: `Invalid DateTime string (${body.timestamp}). Please format your string the way 'yyyy-MM-dd HH:mm:SS'` };
                }
            }
            return this.repository.save(this.repository.merge(new trade_entity_1.TradeEntity(), body));
        });
    }
    getManyTradesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository
                .createQueryBuilder('trade')
                .select()
                .where(`"user" ->> 'id' = '${userId}'`)
                .getMany();
        });
    }
    deleteAllTrades() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.query(`TRUNCATE TABLE trades`);
        });
    }
};
__decorate([
    fastify_decorators_1.Inject(stocks_service_1.StocksService),
    __metadata("design:type", stocks_service_1.StocksService)
], TradesService.prototype, "stocksService", void 0);
__decorate([
    fastify_decorators_1.Initializer([connection_service_1.ConnectionService]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradesService.prototype, "init", null);
TradesService = __decorate([
    fastify_decorators_1.Service(),
    __metadata("design:paramtypes", [connection_service_1.ConnectionService])
], TradesService);
exports.TradesService = TradesService;
//# sourceMappingURL=trades.service.js.map