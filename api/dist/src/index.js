"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const configuration_1 = require("./config/configuration");
const { port: PORT } = configuration_1.default();
const app_1 = require("./app");
const server = app_1.default({
    logger: true,
});
server.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map