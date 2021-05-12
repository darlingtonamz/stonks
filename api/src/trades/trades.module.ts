import { IAppModule } from "../common/interfaces/interfaces";
import TradesController from "./controllers/trades.controller";

export const TradesModule: IAppModule = {
  controllers: [
    TradesController,
  ]
};
