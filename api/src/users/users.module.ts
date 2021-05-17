import { IAppModule } from "../common/interfaces/interfaces";
import { UsersController } from "./controllers/users.controller";

export const UsersModule: IAppModule = {
  controllers: [
    UsersController,
  ],
};
