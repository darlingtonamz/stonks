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
exports.StocksService = void 0;
const fastify_decorators_1 = require("fastify-decorators");
const stock_entity_1 = require("../entities/stock.entity");
const connection_service_1 = require("../../db/providers/connection.service");
const date_fns_1 = require("date-fns");
let StocksService = class StocksService {
    constructor(connectionService) {
        this.connectionService = connectionService;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.repository = this.connectionService.connection.getRepository(stock_entity_1.StockEntity);
        });
    }
    getOneStock(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let stock;
            try {
                stock = yield this.repository.findOne(query, options);
            }
            catch (e) {
                throw { statusCode: 500, message: e };
            }
            if (!stock) {
                throw { statusCode: 404, message: `Stock ${JSON.stringify(query)} not found` };
            }
            return stock;
        });
    }
    createOneStock(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingStock = yield this.repository.findOne({ symbol: body.symbol });
            if (existingStock) {
                throw {
                    statusCode: 400,
                    message: `Stock with the same symbol (${body.symbol}) already exists`,
                };
            }
            return this.repository.save(this.repository.merge(new stock_entity_1.StockEntity(), body));
        });
    }
    getPeriodHighLowStockPrices(symbol, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            start = start ? date_fns_1.format(date_fns_1.parse(start, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd HH:mm:ss') : undefined;
            end = end ? date_fns_1.format(date_fns_1.endOfDay(date_fns_1.parse(end, 'yyyy-MM-dd', new Date())), 'yyyy-MM-dd HH:mm:ss') : undefined;
            const prices = (yield this.repository.query(`SELECT price
          FROM trades 
          WHERE
            symbol = $1 AND timestamp >= $2 AND timestamp <= $3
        `, [symbol, start, end]))
                .map((obj) => obj.price)
                .sort((a, b) => a - b);
            if (prices.length > 0) {
                const [lowest, highest] = [prices[0], prices[prices.length - 1]];
                return { symbol, highest, lowest };
            }
            else {
                return {
                    message: "There are no trades in the given date range"
                };
            }
        });
    }
    getStockStats(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            start = start ? date_fns_1.format(date_fns_1.parse(start, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd HH:mm:ss') : undefined;
            end = end ? date_fns_1.format(date_fns_1.endOfDay(date_fns_1.parse(end, 'yyyy-MM-dd', new Date())), 'yyyy-MM-dd HH:mm:ss') : undefined;
            const stockTradesMap = {};
            const stocks = yield this.repository.query(`SELECT stocks.symbol FROM stocks`);
            stocks.forEach((stock) => {
                stockTradesMap[stock.symbol] = [];
            });
            let trades = [];
            try {
                trades = yield this.repository.query(`SELECT symbol, price
          FROM trades 
          WHERE
            timestamp >= $1 AND timestamp <= $2
          ORDER BY timestamp ASC
        `, [start, end]);
            }
            catch (error) {
                throw {
                    statusCode: 500,
                    message: error,
                };
            }
            if (trades.length > 0) {
                trades.forEach((trade) => {
                    if (!stockTradesMap[trade.symbol]) {
                        stockTradesMap[trade.symbol] = [];
                    }
                    stockTradesMap[trade.symbol].push(trade);
                });
            }
            const output = [];
            for (const symbol in stockTradesMap) {
                let fluctuations = 0;
                const trades = stockTradesMap[symbol];
                if (trades && trades.length > 0) {
                    let currentTrajectory = 'STABLE';
                    let prevPrice = -1;
                    let maxRise = 0;
                    let maxFall = 0;
                    for (const { price: currentPrice } of trades) {
                        let newTrajectory = 'STABLE';
                        if (prevPrice != -1) {
                            const priceDiff = currentPrice - prevPrice;
                            const absPriceDiff = Math.abs(priceDiff);
                            if (priceDiff > 0) {
                                newTrajectory = 'DESC';
                                maxFall = absPriceDiff > maxFall ? absPriceDiff : maxFall;
                            }
                            else if (priceDiff < 0) {
                                newTrajectory = 'ASC';
                                maxRise = absPriceDiff > maxRise ? absPriceDiff : maxRise;
                            }
                        }
                        if (currentTrajectory != newTrajectory) {
                            fluctuations += 1;
                        }
                        currentTrajectory = newTrajectory;
                        prevPrice = currentPrice;
                    }
                    output.push({
                        stock: symbol,
                        fluctuations,
                        'max_rise': Math.round(maxRise * 100) / 100,
                        'max_fall': Math.round(maxFall * 100) / 100,
                    });
                }
                else {
                    output.push({
                        stock: symbol,
                        message: "There are no trades in the given date range",
                    });
                }
            }
            return output;
        });
    }
};
__decorate([
    fastify_decorators_1.Initializer([connection_service_1.ConnectionService]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StocksService.prototype, "init", null);
StocksService = __decorate([
    fastify_decorators_1.Service(),
    __metadata("design:paramtypes", [connection_service_1.ConnectionService])
], StocksService);
exports.StocksService = StocksService;
//# sourceMappingURL=stocks.service.js.map