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
const util_1 = require("../util");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../src/common/constants/constants");
describe('Abilities Controllers', () => {
    let app;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = yield util_1.createApp();
        yield util_1.clearDatabase(typeorm_1.getConnection());
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app.close();
    }));
    describe('Trades Controller', () => {
        let stock;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            stock = (yield app.inject({
                method: 'POST',
                url: '/stocks',
                payload: {
                    "symbol": "ACM",
                }
            })).json();
        }));
        describe('POST /trades', () => {
            it('should return status 201 and create Trade', () => __awaiter(void 0, void 0, void 0, function* () {
                const payload = {
                    type: constants_1.TradeType.BUY,
                    user: {
                        id: "vghfghhghg",
                        name: "gffggfgfgfgf",
                    },
                    symbol: stock.symbol,
                    shares: 29,
                    price: 140,
                    timestamp: "2014-06-14 13:13:13"
                };
                const response = yield app.inject({
                    method: 'POST',
                    url: '/trades',
                    payload,
                });
                const responseJson = response.json();
                expect(response.statusCode).toBe(201);
                expect(responseJson.id).toBeTruthy();
                expect(responseJson.symbol).toEqual(payload.symbol);
                expect(responseJson.user).toEqual(payload.user);
                expect(responseJson.shares).toEqual(payload.shares);
                expect(responseJson.price).toEqual(payload.price);
                expect(responseJson.timestamp).toEqual(payload.timestamp);
            }));
            it('should return status 400 with bad payload', () => __awaiter(void 0, void 0, void 0, function* () {
                const goodPayload = {
                    type: constants_1.TradeType.BUY,
                    user: {
                        id: "vghfghhghg",
                        name: "gffggfgfgfgf",
                    },
                    symbol: stock.symbol,
                    shares: 29,
                    price: 140,
                    timestamp: "2014-06-14 13:13:13"
                };
                const response = yield app.inject({
                    method: 'POST',
                    url: '/trades',
                    payload: Object.assign(Object.assign({}, goodPayload), { type: 'dffddf' }),
                });
                console.log({
                    json: response.json()
                });
                expect(response.statusCode).toBe(400);
            }));
            it('should return status 404 with non-existent entity references', () => __awaiter(void 0, void 0, void 0, function* () {
                const goodPayload = {
                    type: constants_1.TradeType.BUY,
                    user: {
                        id: "vghfghhghg",
                        name: "gffggfgfgfgf",
                    },
                    symbol: stock.symbol,
                    shares: 29,
                    price: 140,
                    timestamp: "2014-06-14 13:13:13"
                };
                const response = yield app.inject({
                    method: 'POST',
                    url: '/trades',
                    payload: Object.assign(Object.assign({}, goodPayload), { symbol: 'NON-EXISTENT-SYMBOL' }),
                });
                console.log({
                    json: response.json()
                });
                expect(response.statusCode).toBe(404);
            }));
        });
        describe('GET /trades', () => {
            it('should return status 200 and return many Trade', () => __awaiter(void 0, void 0, void 0, function* () {
                const existingTrades = (yield app.inject({
                    method: 'GET',
                    url: '/trades',
                })).json();
                const payload = {
                    type: constants_1.TradeType.BUY,
                    user: {
                        id: "vghfghhghg",
                        name: "gffggfgfgfgf",
                    },
                    symbol: stock.symbol,
                    shares: 29,
                    price: 140,
                    timestamp: "2014-06-14 13:13:13"
                };
                yield app.inject({
                    method: 'POST',
                    url: '/trades',
                    payload,
                });
                const tradesCount = (yield app.inject({
                    method: 'GET',
                    url: '/trades',
                })).json().length;
                expect(tradesCount).toEqual(existingTrades.length + 1);
            }));
        });
    });
});
//# sourceMappingURL=trades.e2e-spec.js.map