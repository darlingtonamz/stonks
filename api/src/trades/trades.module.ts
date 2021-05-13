import { IAppModule } from "../common/interfaces/interfaces";
import { TradesController } from "./controllers/trades.controller";
import { TradeStocksController } from "./controllers/tradeStocks.controller";
// import { TradeEntity } from "./entities/trade.entity";

export const TradesModule: IAppModule = {
  controllers: [
    TradesController,
    TradeStocksController,
  ],
  // entities: [TradeEntity],
};
