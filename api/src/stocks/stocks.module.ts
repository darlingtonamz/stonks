import { IAppModule } from "../common/interfaces/interfaces";
import { StocksController } from "./controllers/stocks.controller";

export const StocksModule: IAppModule = {
  controllers: [
    StocksController,
  ],
};
