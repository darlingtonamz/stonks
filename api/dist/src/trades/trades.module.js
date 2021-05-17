"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradesModule = void 0;
const trades_controller_1 = require("./controllers/trades.controller");
const tradeAdmin_controller_1 = require("./controllers/tradeAdmin.controller");
exports.TradesModule = {
    controllers: [
        trades_controller_1.TradesController,
        tradeAdmin_controller_1.TradeAdminController,
    ],
};
//# sourceMappingURL=trades.module.js.map