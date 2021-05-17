import { IAppModule } from "../common/interfaces/interfaces";
import { TradesController } from "./controllers/trades.controller";
import { TradeAdminController } from "./controllers/tradeAdmin.controller";

export const TradesModule: IAppModule = {
  controllers: [
    TradesController,
    TradeAdminController,
  ],
};
