"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesModule = void 0;
const trades_controller_1 = require("./controllers/trades.controller");
const tradeStocks_controller_1 = require("./controllers/tradeStocks.controller");
exports.TradesModule = {
    controllers: [
        trades_controller_1.TradesController,
        tradeStocks_controller_1.TradeStocksController,
    ],
};
//# sourceMappingURL=trades.module.js.map