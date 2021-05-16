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
exports.appModules = void 0;
require("reflect-metadata");
const fastify_1 = require("fastify");
const trades_module_1 = require("./trades/trades.module");
const fastify_decorators_1 = require("fastify-decorators");
const stocks_module_1 = require("./stocks/stocks.module");
const users_module_1 = require("./users/users.module");
const Ajv = require('ajv').default;
const AjvErrors = require('ajv-errors');
exports.appModules = [
    users_module_1.UsersModule,
    trades_module_1.TradesModule,
    stocks_module_1.StocksModule,
];
function build(appOptions = {}) {
    const server = fastify_1.default(appOptions);
    const ajv = new Ajv({
        allErrors: true,
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true,
    });
    AjvErrors(ajv);
    server.setValidatorCompiler(({ schema }) => {
        const validation = ajv.compile(schema);
        return validation;
    });
    let controllers = [];
    for (const module of exports.appModules) {
        controllers = controllers.concat(module.controllers);
    }
    server.register(fastify_decorators_1.bootstrap, {
        controllers
    });
    server.get('/health', {}, () => __awaiter(this, void 0, void 0, function* () {
        return { pong: 'it worked!' };
    }));
    return server;
}
exports.default = build;
//# sourceMappingURL=app.js.map