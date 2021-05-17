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
const faker = require("faker");
const util_1 = require("../util");
const typeorm_1 = require("typeorm");
const constants_1 = require("../../src/common/constants/constants");
describe('Trades module', () => {
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
        let user;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            user = (yield app.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    "name": faker.finance.currencyCode(),
                }
            })).json();
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
                        id: user.id,
                        name: user.name,
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
                        id: user.id,
                        name: user.name,
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
                expect(response.statusCode).toBe(400);
            }));
            it('should return status 404 with non-existent entity references', () => __awaiter(void 0, void 0, void 0, function* () {
                const goodPayload = {
                    type: constants_1.TradeType.BUY,
                    user: {
                        id: user.id,
                        name: user.name,
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
                expect(response.statusCode).toBe(404);
                const response2 = yield app.inject({
                    method: 'POST',
                    url: '/trades',
                    payload: Object.assign(Object.assign({}, goodPayload), { user: {
                            id: faker.datatype.uuid(),
                        } }),
                });
                expect(response2.statusCode).toBe(404);
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
                        id: user.id,
                        name: user.name,
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
        describe('GET /trades/users/:user_id', () => {
            it('should return status 200 and return many Trade belonging to user', () => __awaiter(void 0, void 0, void 0, function* () {
                const newUser = (yield app.inject({
                    method: 'POST',
                    url: '/users',
                    payload: {
                        "name": faker.finance.currencyCode(),
                    }
                })).json();
                const externalUser = (yield app.inject({
                    method: 'POST',
                    url: '/users',
                    payload: {
                        "name": faker.finance.currencyCode(),
                    }
                })).json();
                const newStock = (yield app.inject({
                    method: 'POST',
                    url: '/stocks',
                    payload: {
                        "symbol": faker.finance.currencyCode().toUpperCase(),
                    }
                })).json();
                let response = yield app.inject({
                    method: 'POST',
                    url: '/trades',
                    payload: {
                        type: constants_1.TradeType.BUY,
                        user: {
                            id: externalUser.id,
                            name: externalUser.name,
                        },
                        symbol: stock.symbol,
                        shares: 29,
                        price: 140,
                        timestamp: "2014-06-14 13:13:13"
                    },
                });
                expect(response.statusCode).toBe(201);
                let externalTrades = (yield app.inject({
                    method: 'GET',
                    url: `/trades`,
                })).json();
                expect(externalTrades.length > 0).toEqual(true);
                let userTrades = (yield app.inject({
                    method: 'GET',
                    url: `/trades/users/${newUser.id}`,
                })).json();
                expect(userTrades.length).toEqual(0);
                response = yield app.inject({
                    method: 'POST',
                    url: '/trades',
                    payload: {
                        type: constants_1.TradeType.BUY,
                        user: {
                            id: newUser.id,
                            name: newUser.name,
                        },
                        symbol: newStock.symbol,
                        shares: 29,
                        price: 140,
                        timestamp: "2014-06-14 13:13:13"
                    },
                });
                expect(response.statusCode).toBe(201);
                response = yield app.inject({
                    method: 'POST',
                    url: '/trades',
                    payload: {
                        type: constants_1.TradeType.BUY,
                        user: {
                            id: newUser.id,
                            name: newUser.name,
                        },
                        symbol: newStock.symbol,
                        shares: 13,
                        price: 150,
                        timestamp: "2014-06-14 13:13:13"
                    },
                });
                expect(response.statusCode).toBe(201);
                userTrades = (yield app.inject({
                    method: 'GET',
                    url: `/trades/users/${newUser.id}`,
                })).json();
                expect(userTrades.length).toEqual(2);
            }));
        });
        describe('DELETE /erase', () => {
            it('should return status 200 and return all Trade', () => __awaiter(void 0, void 0, void 0, function* () {
                for (let i = 0; i < 5; i++) {
                    const response = yield app.inject({
                        method: 'POST',
                        url: '/trades',
                        payload: {
                            type: constants_1.TradeType.BUY,
                            user: {
                                id: user.id,
                                name: user.name,
                            },
                            symbol: stock.symbol,
                            shares: 13,
                            price: 150,
                            timestamp: "2014-06-14 13:13:13"
                        },
                    });
                    expect(response.statusCode).toBe(201);
                }
                let trades = (yield app.inject({
                    method: 'GET',
                    url: `/trades`,
                })).json();
                expect(trades.length > 0).toEqual(true);
                let response = yield app.inject({
                    method: 'DELETE',
                    url: '/erase',
                });
                expect(response.statusCode).toBe(200);
                trades = (yield app.inject({
                    method: 'GET',
                    url: `/trades`,
                })).json();
                expect(trades.length).toEqual(0);
            }));
        });
    });
});
//# sourceMappingURL=trades.e2e-spec.js.map